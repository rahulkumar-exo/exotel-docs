#!/bin/bash
# ============================================================
# Deploy A/B Testing — AWS CloudFront + Lambda@Edge
#
# Prerequisites:
#   - AWS CLI configured with appropriate permissions
#   - ACM certificate for developer.exotel.com in us-east-1
#   - Route 53 hosted zone for developer.exotel.com
#
# Usage:
#   ./deploy.sh                          # Full deployment
#   ./deploy.sh update-lambda            # Update Lambda code only (fast)
#   ./deploy.sh update-split 25          # Change traffic split to 25%
#   ./deploy.sh rollback                 # Set split to 0% (all traffic to old site)
# ============================================================

set -e

STACK_NAME="exotel-docs-ab-test"
REGION="us-east-1"  # Required for Lambda@Edge
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

case "${1:-deploy}" in

  deploy)
    echo -e "${GREEN}=== Deploying CloudFront + Lambda@Edge Stack ===${NC}"
    echo ""

    # Prompt for required parameters
    read -p "WordPress origin domain (e.g., legacy-developer.exotel.com): " WP_ORIGIN
    read -p "ACM Certificate ARN (us-east-1): " ACM_ARN
    read -p "Route 53 Hosted Zone ID: " HOSTED_ZONE_ID

    echo ""
    echo -e "${YELLOW}Deploying CloudFormation stack...${NC}"

    aws cloudformation deploy \
      --region "$REGION" \
      --stack-name "$STACK_NAME" \
      --template-file "$SCRIPT_DIR/cloudformation-template.yaml" \
      --capabilities CAPABILITY_NAMED_IAM \
      --parameter-overrides \
        WordPressOriginDomain="$WP_ORIGIN" \
        AcmCertificateArn="$ACM_ARN" \
        HostedZoneId="$HOSTED_ZONE_ID" \
      --no-fail-on-empty-changeset

    echo ""
    echo -e "${GREEN}Stack deployed. Now uploading Lambda code...${NC}"

    # Upload actual Lambda code
    "$0" update-lambda

    echo ""
    echo -e "${GREEN}=== Deployment Complete ===${NC}"
    echo ""

    # Show outputs
    aws cloudformation describe-stacks \
      --region "$REGION" \
      --stack-name "$STACK_NAME" \
      --query 'Stacks[0].Outputs' \
      --output table

    echo ""
    echo -e "${YELLOW}IMPORTANT: DNS will take 5-15 minutes to propagate.${NC}"
    echo -e "${YELLOW}Test with: curl -sI https://developer.exotel.com | grep X-Docs${NC}"
    ;;

  update-lambda)
    echo -e "${GREEN}=== Updating Lambda@Edge Functions ===${NC}"

    # Package viewer request function
    echo "Packaging viewer-request Lambda..."
    cd "$SCRIPT_DIR"
    cp lambda-at-edge.js index.js
    zip -j viewer-request.zip index.js
    rm index.js

    # Package origin response function
    echo "Packaging origin-response Lambda..."
    cp lambda-origin-response.js index.js
    zip -j origin-response.zip index.js
    rm index.js

    # Update viewer request function
    echo "Deploying viewer-request Lambda..."
    aws lambda update-function-code \
      --region "$REGION" \
      --function-name exotel-docs-ab-viewer-request \
      --zip-file "fileb://$SCRIPT_DIR/viewer-request.zip"

    # Wait for update to complete
    aws lambda wait function-updated \
      --region "$REGION" \
      --function-name exotel-docs-ab-viewer-request

    # Publish new version (required for Lambda@Edge)
    VIEWER_VERSION=$(aws lambda publish-version \
      --region "$REGION" \
      --function-name exotel-docs-ab-viewer-request \
      --description "Updated $(date -u +%Y-%m-%dT%H:%M:%SZ)" \
      --query 'Version' --output text)
    echo -e "  Viewer Request: version ${GREEN}$VIEWER_VERSION${NC}"

    # Update origin response function
    echo "Deploying origin-response Lambda..."
    aws lambda update-function-code \
      --region "$REGION" \
      --function-name exotel-docs-ab-origin-response \
      --zip-file "fileb://$SCRIPT_DIR/origin-response.zip"

    aws lambda wait function-updated \
      --region "$REGION" \
      --function-name exotel-docs-ab-origin-response

    RESPONSE_VERSION=$(aws lambda publish-version \
      --region "$REGION" \
      --function-name exotel-docs-ab-origin-response \
      --description "Updated $(date -u +%Y-%m-%dT%H:%M:%SZ)" \
      --query 'Version' --output text)
    echo -e "  Origin Response: version ${GREEN}$RESPONSE_VERSION${NC}"

    # Clean up zip files
    rm -f viewer-request.zip origin-response.zip

    echo ""
    echo -e "${YELLOW}NOTE: After updating Lambda versions, you need to update the${NC}"
    echo -e "${YELLOW}CloudFront distribution to use the new versions. This requires${NC}"
    echo -e "${YELLOW}updating the CloudFormation stack or using the AWS Console.${NC}"
    echo ""
    echo -e "${GREEN}Lambda functions updated successfully.${NC}"
    ;;

  update-split)
    PERCENTAGE="${2:-10}"
    echo -e "${GREEN}=== Updating Traffic Split to ${PERCENTAGE}% ===${NC}"

    # Update the SPLIT_PERCENTAGE in the Lambda code
    sed -i.bak "s/SPLIT_PERCENTAGE: [0-9]*/SPLIT_PERCENTAGE: $PERCENTAGE/" "$SCRIPT_DIR/lambda-at-edge.js"
    rm -f "$SCRIPT_DIR/lambda-at-edge.js.bak"

    echo "Updated SPLIT_PERCENTAGE to $PERCENTAGE in lambda-at-edge.js"
    echo "Deploying updated Lambda..."

    "$0" update-lambda

    echo ""
    echo -e "${GREEN}Traffic split updated to ${PERCENTAGE}% new / $((100 - PERCENTAGE))% old${NC}"
    echo -e "${YELLOW}Changes take effect after CloudFront propagation (~5 min)${NC}"
    ;;

  rollback)
    echo -e "${RED}=== ROLLBACK: Setting traffic to 0% (all traffic to old site) ===${NC}"
    "$0" update-split 0
    echo ""
    echo -e "${RED}ROLLBACK COMPLETE. All traffic now goes to WordPress.${NC}"
    ;;

  status)
    echo -e "${GREEN}=== A/B Test Status ===${NC}"
    echo ""

    # Get current split percentage from Lambda code
    CURRENT_SPLIT=$(grep 'SPLIT_PERCENTAGE:' "$SCRIPT_DIR/lambda-at-edge.js" | grep -o '[0-9]*')
    echo "Current split: ${CURRENT_SPLIT}% new / $((100 - CURRENT_SPLIT))% old"
    echo ""

    # Check CloudFront distribution status
    DIST_ID=$(aws cloudformation describe-stacks \
      --region "$REGION" \
      --stack-name "$STACK_NAME" \
      --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
      --output text 2>/dev/null || echo "NOT DEPLOYED")

    if [ "$DIST_ID" != "NOT DEPLOYED" ]; then
      DIST_STATUS=$(aws cloudfront get-distribution \
        --id "$DIST_ID" \
        --query 'Distribution.Status' \
        --output text)
      echo "CloudFront Distribution: $DIST_ID"
      echo "Status: $DIST_STATUS"
    else
      echo "CloudFormation stack not found. Run './deploy.sh deploy' first."
    fi

    echo ""

    # Test the endpoint
    echo "Testing developer.exotel.com..."
    VARIANT=$(curl -sI "https://developer.exotel.com" 2>/dev/null | grep -i "x-docs-variant" | awk '{print $2}' | tr -d '\r')
    SPLIT=$(curl -sI "https://developer.exotel.com" 2>/dev/null | grep -i "x-docs-split" | awk '{print $2}' | tr -d '\r')

    if [ -n "$VARIANT" ]; then
      echo "  Variant: $VARIANT"
      echo "  Split: $SPLIT"
    else
      echo "  No A/B headers detected (worker may not be deployed yet)"
    fi
    ;;

  *)
    echo "Usage: $0 {deploy|update-lambda|update-split <percentage>|rollback|status}"
    exit 1
    ;;
esac

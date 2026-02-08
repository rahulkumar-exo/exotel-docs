---
id: manage-allocations
title: Manage VN Allocations
sidebar_label: Manage Allocations
---

# Manage GreenVN Allocations

## Create a VN Allocation

Maps a set of numbers (A-party) to another set of numbers (B-party) using a virtual number.

```
POST https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenvn
```

### Authentication

Replace API key with Account SID and API token with ExoBridge token.

---

## Get VN Allocation Details

```
GET https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenvn/<greenvn_id>
```

---

## Delete VN Allocation

Removes the mapping from the virtual number.

```
DELETE https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenvn/<greenvn_id>
```

---

## Update Party Numbers & PINs

```
PUT https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenvn/<greenvn_id>/call-party
```

Updates A-party/B-party numbers and PIN configurations.

---

## Update GreenVN in Allocation

```
PUT https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenvn/<greenvn_id>/vn
```

Updates the virtual number in an existing active allocation.

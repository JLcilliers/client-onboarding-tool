# Access Checklist Field Mapping (v1 ↔ v2)

## v1 → v2 Canonical Field Mapping

| v1 Field | v1 Step Key | v2 Canonical Field | Value Mapping |
|----------|-------------|-------------------|---------------|
| `ga_access_granted` | `google_access` | `ga_access_status` | granted/will_do → done |
| `gsc_access_granted` | `google_access` | `gsc_access_status` | granted/will_do → done |
| `gbp_access_granted` | `google_access` | `gbp_access_status` | granted/will_do → done |
| `wordpress_access_granted` | `website_access` | `wordpress_access_status` | granted/will_do → done |
| `domain_registrar_access` | `website_access` | `domain_access_status` | granted/will_share_login → done |
| `dns_access_granted` | `website_access` | `dns_access_status` | granted/will_do → done |
| `youtube_access_granted` | `other_access` | `youtube_access_status` | granted/will_do → done |

## v2 Status Values

| Value | Meaning |
|-------|---------|
| `done` | Access granted |
| `later` | Will do later |
| `need_help` | Needs assistance |
| `not_applicable` | Service not used |

## Gating Fields

| Gate Field | Controls | Logic |
|------------|----------|-------|
| `has_google_analytics` | GA row visibility | Show if `yes` |
| `has_youtube` | YouTube row visibility | Show if `yes` |

## Deferred from v2

| Field | Reason |
|-------|--------|
| `has_lsa` | Niche — ask in strategy call |
| `lsa_customer_ids` | Niche — ask in strategy call |

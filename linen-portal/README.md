# Linen Works — Customer & Staff Portal

A login-gated portal for the Linen Works inventory:

- **Customers** sign up, browse the linen catalog and place orders.
- **Employees (staff)** approve new customers, see incoming orders and mark them
  fulfilled, and manage inventory and stock levels.

Like the rest of this repo it is **plain HTML/CSS/JS with no build step**. The
backend (auth + database + APIs) is **[Supabase](https://supabase.com)** — a
hosted Postgres with built-in authentication. The browser talks to it directly
through the Supabase JS client (loaded from a CDN), and **Row-Level Security**
in the database enforces who can see and do what.

```
linen-portal/
├── index.html            login + customer sign-up
├── customer.html         catalog, basket, place orders, order history
├── employee.html         orders queue, inventory management, customer approval
├── styles.css            shared styling (Linen Works palette)
├── app.js                Supabase client + auth/role helpers
├── config.example.js     template → copy to config.js with your keys
└── supabase-schema.sql   tables + security policies + seed inventory (run once)
```

---

## One-time setup

### 1. Create a Supabase project
1. Sign up at <https://supabase.com> and create a new project (free tier is fine).
2. Choose a database password and a region near Denmark (e.g. *EU Central*).

### 2. Create the database
1. In the Supabase dashboard open **SQL Editor → New query**.
2. Paste the entire contents of [`supabase-schema.sql`](./supabase-schema.sql) and
   click **Run**. This creates the tables, security policies, and a starter set
   of linen items. It is safe to re-run.

### 3. Add your keys
1. In the dashboard go to **Project Settings → API**.
2. Copy `config.example.js` to **`config.js`** and paste in:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`

   ```bash
   cp config.example.js config.js   # then edit config.js
   ```
   > The **anon** key is designed to be public — it is safe to commit and to ship
   > to the browser. RLS is what protects the data. **Never** put the
   > `service_role` key in this file.

### 4. Create your first staff account
1. Serve the portal (see below) and open `index.html` → **Create an account**.
   Sign up with your own email. (Or create a user under **Authentication → Users**.)
2. Promote that account to employee — in **SQL Editor** run:
   ```sql
   update public.profiles
   set role = 'employee', status = 'active'
   where id = (select id from auth.users where email = 'you@example.com');
   ```
3. Sign in again — you now land on the **staff dashboard**.

### 5. (Recommended) Confirm the auth email setting
Under **Authentication → Providers → Email**, decide whether new sign-ups must
confirm their email. With confirmation **on**, customers click a link before they
can sign in (more secure). With it **off**, they can sign in immediately but still
can't order until you approve them. Either works.

---

## Running locally

No build step — just serve the folder (the JS uses ES modules, so opening the
file directly with `file://` won't work; it must be served over http):

```bash
cd linen-portal
python -m http.server 8000
# open http://localhost:8000
```

---

## How it works (the flow)

1. A customer signs up → their profile is created with status **pending**.
2. A staff member opens **Customers**, sees the pending account and clicks
   **Approve** → status becomes **active**.
3. The customer can now set quantities in the catalog, review the basket and
   **place an order** (status **pending**).
4. Staff see it in **Orders**, click **Start processing**, then **Mark fulfilled**.
5. The customer sees the live status under **My orders**.

Stock levels and the catalog are edited by staff under **Inventory** (and the
"+ Add new item" panel). No payment/invoicing — that stays offline, as agreed.

---

## Deploying

Deploy this `linen-portal/` subfolder the same way as the marketing sites:
a static host (Netlify / Cloudflare Pages / Vercel) pointing at this folder with
**no build command**. Suggested domain: `portal.linenworks.dk`.

Make sure **`config.js` exists** in the deployed files (it is required at runtime).
In Supabase, add your portal's domain under **Authentication → URL Configuration**
(Site URL + redirect URLs) so auth emails point at the right place.

## Security notes

- All data access goes through Postgres Row-Level Security: customers can only
  ever read/write **their own** orders; only **active** customers can order; only
  **employees** can manage inventory, see all orders, or change account status.
- The browser only ever holds the public **anon** key. Privileged operations are
  permitted by RLS policies tied to the signed-in user's role, not by a secret.

## Possible next steps

- Staff-creates-account directly (Supabase Edge Function with the admin API),
  instead of self-signup + approval.
- Order quantities checked/decremented against live stock.
- Email notifications on new orders / status changes.
- Online payment or invoice export.

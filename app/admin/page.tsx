import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Admin — BLUR",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type OrderItem = {
  product_name: string;
  product_code: string;
  quantity: number;
  unit_amount: number;
};

type Order = {
  id: string;
  stripe_checkout_session_id: string;
  email: string | null;
  status: string;
  currency: string;
  amount_total: number | null;
  created_at: string;
  paid_at: string | null;
  order_items: OrderItem[] | null;
};

function AdminState({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="admin-page page-shell">
      <section className="admin-panel">
        <p className="eyebrow">BLUR / admin</p>
        <h1>{title}</h1>
        <div className="admin-panel-copy">{children}</div>
        <Link href="/" className="text-link">Return to storefront ↗</Link>
      </section>
    </main>
  );
}

function formatMoney(amount: number | null, currency: string) {
  const normalizedCurrency = currency.toUpperCase();
  const total = (amount ?? 0) / 100;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: normalizedCurrency,
    }).format(total);
  } catch {
    return `${total.toFixed(2)} ${normalizedCurrency}`;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    return (
      <AdminState title="Admin setup is waiting">
        <p>Add the Supabase URL and publishable key in Vercel, then run <code>supabase/schema.sql</code> in the Supabase SQL Editor.</p>
      </AdminState>
    );
  }

  let supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return (
      <AdminState title="Admin setup is incomplete">
        <p>Check the Supabase environment values in Vercel and redeploy.</p>
      </AdminState>
    );
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    return (
      <AdminState title="Admin setup is incomplete">
        <p>The storefront could not verify the Supabase session. Check the project URL, publishable key, and redirect URLs.</p>
      </AdminState>
    );
  }

  if (!user) {
    redirect("/account?next=/admin");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return (
      <AdminState title="Admin setup is incomplete">
        <p>Run <code>supabase/schema.sql</code> in the Supabase SQL Editor, then mark the owner account as an admin there.</p>
      </AdminState>
    );
  }

  if (profile?.role !== "admin") {
    return (
      <AdminState title="Admin access only">
        <p>This account is not marked as a BLUR administrator. An existing admin can promote it in the Supabase SQL Editor.</p>
      </AdminState>
    );
  }

  const { data, error: ordersError } = await supabase
    .from("orders")
    .select("id, stripe_checkout_session_id, email, status, currency, amount_total, created_at, paid_at, order_items(product_name, product_code, quantity, unit_amount)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (ordersError) {
    return (
      <AdminState title="Order data is not ready">
        <p>Run <code>supabase/schema.sql</code> and make sure the Stripe webhook has a Supabase service-role key in Vercel.</p>
      </AdminState>
    );
  }

  const orders = (data ?? []) as Order[];

  return (
    <main className="admin-page page-shell">
      <section className="admin-panel admin-orders">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">BLUR / order desk</p>
            <h1>Orders</h1>
          </div>
          <Link href="/" className="text-link">Storefront ↗</Link>
        </div>

        {orders.length === 0 ? (
          <p className="admin-empty">No paid test orders yet. New Stripe Checkout payments will appear here after the webhook records them.</p>
        ) : (
          <div className="admin-order-list">
            {orders.map((order) => (
              <article className="admin-order" key={order.id}>
                <div className="admin-order-meta">
                  <p><strong>{formatMoney(order.amount_total, order.currency)}</strong> · {order.status}</p>
                  <p>{order.email ?? "No email collected"}</p>
                  <p>{formatDate(order.paid_at ?? order.created_at)}</p>
                </div>
                <ul className="admin-order-lines">
                  {(order.order_items ?? []).map((item) => (
                    <li key={`${order.id}-${item.product_code}`}>
                      {item.quantity} × {item.product_name} <span>{formatMoney(item.unit_amount * item.quantity, order.currency)}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

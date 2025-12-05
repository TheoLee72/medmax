// route removed during rollback — intentionally inert to restore previous client-only behavior
export async function POST() {
  return new Response(JSON.stringify({ error: 'route removed' }), { status: 410, headers: { 'Content-Type': 'application/json' } })
}

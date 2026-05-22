export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  res.status(200).end()

  const { topic, data } = req.body
  if (!data) return

  console.log(`Lulu [${topic}]: job ${data.id} → ${data.status?.name ?? 'unknown'}`)

  if (topic === 'PRINT_JOB_STATUS_CHANGED' && data.status?.name === 'SHIPPED') {
    const trackingUrls = (data.line_item_statuses ?? [])
      .flatMap((item) => item.tracking_urls ?? [])
    console.log('Book shipped! Tracking:', trackingUrls.join(', ') || 'none')
    // TODO: send shipping confirmation email to customer
  }
}

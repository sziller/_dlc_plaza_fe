import { createLuluPrintJob } from '../_lulu.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  // Always ack immediately
  res.status(200).end()

  const { id, status, extra } = req.body

  if (status === 'unconfirmed') {
    console.log(`SBP on-chain detected for order ${id}`)
    return
  }

  if (status !== 'paid') return

  // Order data comes back from SBP in the extra field
  if (!extra?.shipping) {
    console.error('SBP webhook: missing extra data for id', id)
    return
  }

  try {
    const job = await createLuluPrintJob(id, extra)
    console.log(`Lulu print job created: ${job.id} for invoice ${id}`)
  } catch (err) {
    console.error('Lulu createPrintJob failed:', err.response?.data || err.message)
  }
}

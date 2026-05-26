import { createLuluPrintJob } from '../_lulu.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  console.log('SBP webhook body:', JSON.stringify(req.body, null, 2))

  const { id, status, extra } = req.body

  if (status === 'unconfirmed') {
    console.log(`SBP on-chain detected for order ${id}`)
    return res.status(200).end()
  }

  if (status !== 'paid' && status !== 'settled') return res.status(200).end()

  if (!extra?.shipping) {
    console.error('SBP webhook: missing extra data for id', id)
    return res.status(200).end()
  }

  try {
    const job = await createLuluPrintJob(id, extra)
    console.log(`Lulu print job created: ${job.id} for invoice ${id}`)
  } catch (err) {
    console.error('Lulu createPrintJob failed:', JSON.stringify(err.response?.data, null, 2) || err.message)
  }

  res.status(200).end()
}

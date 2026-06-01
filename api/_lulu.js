import axios from 'axios'

export async function getLuluToken() {
  const credentials = Buffer.from(
    `${process.env.LULU_CLIENT_KEY}:${process.env.LULU_CLIENT_SECRET}`
  ).toString('base64')

  const res = await axios.post(
    'https://api.lulu.com/auth/realms/glasstree/protocol/openid-connect/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )
  return res.data.access_token
}

export async function createLuluPrintJob(invoiceId, { quantity, shipping }) {
  const token = await getLuluToken()

  // Normalise field names — SBP sends firstName/lastName/country/phone,
  // Stripe sends name/country_code/phone_number (stored in metadata).
  const name = shipping.name
    ?? `${shipping.firstName ?? ''} ${shipping.lastName ?? ''}`.trim()
  const country_code = shipping.country_code ?? shipping.country ?? ''
  const state_code = shipping.state_code ?? shipping.state ?? ''
  const phone_number = shipping.phone_number ?? shipping.phone ?? ''

  const shippingAddress = {
    city: shipping.city,
    country_code,
    name,
    phone_number,
    postcode: shipping.postcode,
    state_code,
    street1: shipping.street1,
  }
  if (shipping.street2) shippingAddress.street2 = shipping.street2

  const res = await axios.post(
    'https://api.lulu.com/print-jobs/',
    {
      contact_email: process.env.LULU_CONTACT_EMAIL || 'noah@cadenabitcoin.com',
      external_id: `${invoiceId}`,
      line_items: [
        {
          external_id: `item-${invoiceId}`,
          printable_normalization: {
            pod_package_id: '0600X0900.FC.STD.PB.060UW444.MXX',
            interior: { source_url: process.env.BOOK_INTERIOR_URL },
            cover: { source_url: process.env.BOOK_COVER_URL },
          },
          quantity,
          title: 'Endgame — Kevin Bell',
        },
      ],
      production_delay: 120,
      shipping_address: shippingAddress,
      shipping_level: 'MAIL',
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  return res.data
}

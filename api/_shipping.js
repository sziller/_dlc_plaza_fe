import { getLuluToken } from './_lulu.js'
import axios from 'axios'

const PAGE_COUNT = 101
const POD_PACKAGE_ID = '0600X0900.BW.STD.PB.060UW444.MXX'

export async function getShippingCost(shipping, quantity = 1) {
  const token = await getLuluToken()

  const { data } = await axios.post(
    'https://api.lulu.com/print-job-cost-calculations/',
    {
      line_items: [
        {
          pod_package_id: POD_PACKAGE_ID,
          quantity,
          page_count: PAGE_COUNT,
        },
      ],
      shipping_address: {
        name: shipping.name ?? `${shipping.firstName ?? ''} ${shipping.lastName ?? ''}`.trim() || 'Customer',
        country_code: shipping.country_code ?? shipping.country,
        postcode: shipping.postcode,
        state_code: shipping.state_code ?? shipping.state ?? undefined,
        city: shipping.city,
        street1: shipping.street1 ?? '',
      },
      shipping_option: 'MAIL',
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )

  // Lulu returns costs as strings — parse to float
  console.log('Lulu cost-calc response:', JSON.stringify(data, null, 2))

  const shippingCost = parseFloat(
    data.shipping_cost?.total_cost_excl_tax ??
    data.shipping_cost?.total_cost_incl_tax ??
    0
  )

  return { shippingCost, raw: data }
}

import { Product } from '../types';

export function formatPrice(amount: number): string {
  if (isNaN(amount)) return '£0.00';
  return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function isValidUKPostcode(postcode: string): boolean {
  if (!postcode) return false;
  // Standard UK Postcode regex
  const ukPostcodeRegex = /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})$/i;
  return ukPostcodeRegex.test(postcode.trim());
}

export function validateUKPostcode(postcode: string): boolean {
  return isValidUKPostcode(postcode);
}

export function formatUKPostcode(postcode: string): string {
  if (!postcode) return '';
  const clean = postcode.replace(/\s+/g, '').toUpperCase();
  if (clean.length > 3) {
    const inward = clean.slice(-3);
    const outward = clean.slice(0, -3);
    return `${outward} ${inward}`;
  }
  return clean;
}

export function cleanPhoneForWhatsApp(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '44' + cleaned.slice(1);
  }
  if (!cleaned.startsWith('44')) {
    cleaned = '447862600142';
  }
  return cleaned;
}

export function generateWhatsAppOrderUrl(
  customer: any,
  items: any[],
  total: number,
  businessNumber: string = '+44 7862 600142'
): string {
  const targetPhone = cleanPhoneForWhatsApp(businessNumber);

  const productList = items
    .map((item, idx) => {
      const pName = item.product?.name || item.productName || 'Furniture Item';
      const size = item.selectedOptions?.size || item.selectedSize || 'Standard';
      const colour = item.selectedOptions?.colour || item.selectedColour || 'Standard';
      const mattress = item.selectedOptions?.mattress?.name || item.selectedMattress?.name;
      const qty = item.quantity || 1;
      const price = (item.unitPrice || item.price || 0) * qty;

      let line = `${idx + 1}. *${pName}* x ${qty}\n   - Size: ${size}\n   - Colour: ${colour}`;
      if (mattress) line += `\n   - Mattress: ${mattress}`;
      line += `\n   - Item Total: ${formatPrice(price)}`;
      return line;
    })
    .join('\n\n');

  const customerName = customer?.fullName || 'Customer';
  const customerPhone = customer?.phone || '';
  const customerAddress = customer?.address || customer?.addressLine1 || '';
  const customerCity = customer?.city || customer?.townCity || '';
  const customerPostcode = customer?.postcode || '';
  const customerRoom = customer?.roomOfChoice || 'Room of choice';

  const message = `*NEW ORDER - UK FURNITURE HUB* 🇬🇧
-----------------------------------------
*CUSTOMER DETAILS:*
• Name: ${customerName}
• Mobile: ${customerPhone}
• Delivery Address: ${customerAddress}
• City: ${customerCity}
• Postcode: ${customerPostcode}
• Room of Choice: ${customerRoom}

*ORDERED ITEMS:*
${productList}

-----------------------------------------
*DELIVERY:* FREE UK Home Delivery (£0.00)
*TOTAL DUE ON DELIVERY:* ${formatPrice(total)}
*PAYMENT METHOD:* Cash on Delivery (Pay upon arrival)

Please confirm my delivery route. Thank you!`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppProductEnquiryUrl(
  product: Product,
  businessNumber: string = '+44 7862 600142',
  selectedColour?: string,
  selectedSize?: string,
  selectedMattress?: string
): string {
  const targetPhone = cleanPhoneForWhatsApp(businessNumber);

  let message = `Hello UK Furniture Hub! 👋\n\nI am interested in ordering the *${product.name}* (Price: £${product.salePrice || product.price}).`;
  if (selectedColour) {
    message += `\n• Preferred Colour: ${selectedColour}`;
  }
  if (selectedSize) {
    message += `\n• Preferred Size: ${selectedSize}`;
  }
  if (selectedMattress) {
    message += `\n• Mattress Option: ${selectedMattress}`;
  }
  message += `\n\nCould you please check availability and delivery time for my postcode with Cash on Delivery? Thank you!`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

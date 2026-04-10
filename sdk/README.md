# @aditya/gallery-ocr-sdk

OCR text extraction SDK with support for GST invoices, medical prescriptions and logistics documents.

## Install
```bash
npm install @aditya/gallery-ocr-sdk
```

## Usage
```typescript
import { GalleryOcr, classifyDocument, extractGstInvoice } from '@aditya/gallery-ocr-sdk';

const ocr = new GalleryOcr({ domain: 'gst_invoice' });

const result = ocr.parseText('Invoice No: INV-001 GSTIN: 22AAAAA0000A1Z5 Total: ₹5000');
console.log(result);

const domain = classifyDocument(rawText);
const invoice = extractGstInvoice(rawText);
```

## Domains
- `gst_invoice` — invoice number, GSTIN, vendor, amount, date
- `medical_rx` — drug name, dosage, frequency, doctor, date
- `logistics` — tracking ID, courier, sender, receiver, pincode, date
- `general` — fallback, no extraction

## Build
```bash
npm run build
```
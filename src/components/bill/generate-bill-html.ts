import { OrderStatus } from "@/type/constant";
import { GetOrdersResType } from "@/type/schema/order.schema";
import { format } from "date-fns";

type OrderItem = GetOrdersResType["data"][0];

interface Bill {
  guestId: number;
  guestName: string;
  tableNumber: number | null;
  orders: OrderItem[];
  totalAmount: number;
  cashierName?: string;
}

function formatVnd(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export function generateBillHtml(bill: Bill): string {
  const now = format(new Date(), "dd/MM/yyyy HH:mm:ss");
  const cashier = bill.cashierName ?? "Thu ngân";

  // Build product rows (only Delivered/Paid shown normally; others struck through)
  const itemRows = bill.orders
    .map((o) => {
      const isPaid =
        o.status === OrderStatus.Delivered || o.status === OrderStatus.Paid;
      const strikeStyle = !isPaid
        ? 'style="text-decoration:line-through;color:#999;"'
        : "";
      return `
        <tr>
          <td colspan="3" class="item-name" ${strikeStyle}>${o.dishSnapshot.name}</td>
        </tr>
        <tr class="item-details" ${strikeStyle}>
          <td></td>
          <td class="text-center">${o.quantity}</td>
          <td class="text-right">${formatVnd(o.dishSnapshot.basePrice * o.quantity)}</td>
        </tr>`;
    })
    .join("");

  // Absolute URL for logo (works in popup windows)
  const logoUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/LOGO.jpg`
      : "/LOGO.jpg";

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hoa Don - Ban ${bill.tableNumber ?? "?"} - ${bill.guestName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: #e0e0e0;
      display: flex;
      justify-content: center;
      padding: 20px;
      font-family: 'Courier New', Courier, monospace;
      color: #000;
    }

    .receipt {
      width: 320px;
      background-color: #fff;
      padding: 15px 10px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }

    .header { text-align: center; margin-bottom: 10px; }

    .logo {
      width: 80px;
      height: auto;
      margin-bottom: 5px;
      filter: grayscale(100%) contrast(1.2);
    }

    .header h2 {
      font-size: 20px;
      text-transform: uppercase;
      margin-bottom: 3px;
    }

    .header p { font-size: 13px; line-height: 1.4; }

    .text-center { text-align: center; }
    .text-left   { text-align: left; }
    .text-right  { text-align: right; }

    .title {
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      margin: 10px 0;
    }

    .divider       { border-top: 1px dashed #000; margin: 8px 0; }
    .divider-solid { border-top: 1px solid #000;  margin: 8px 0; }

    .time-info { font-size: 12px; margin-bottom: 5px; }

    table { width: 100%; border-collapse: collapse; font-size: 13px; }

    th, td { padding: 4px 0; vertical-align: top; }

    .item-name { font-weight: bold; padding-bottom: 0; }
    .item-details td { padding-top: 0; padding-bottom: 6px; }

    .summary-table { margin-top: 5px; }
    .summary-table td { padding: 3px 0; }

    .total-row { font-size: 16px; font-weight: bold; }

    .footer {
      text-align: center;
      font-size: 12px;
      margin-top: 15px;
      font-style: italic;
    }

    @media print {
      @page { size: 80mm auto; margin: 6mm; }
      body { background-color: #fff; padding: 0; }
      .receipt { box-shadow: none; width: 100%; }
    }
  </style>
</head>
<body>
  <div class="receipt">

    <!-- HEADER -->
    <div class="header">
      <img src="${logoUrl}" alt="Logo" class="logo">
      <h2>Quán Nhà Mộc</h2>
      <p>Hà Nội</p>
      <p>Hotline: 12345</p>
    </div>

    <!-- THỜI GIAN -->
    <div class="time-info">
      <p>THOI GIAN: ${now}</p>
      <p>Thu ngan : ${cashier}</p>
      <p>Ban: ${bill.tableNumber ?? "?"} &nbsp;|&nbsp; Ma HD: QNM_${bill.guestId}</p>
      <p>Khach: ${bill.guestName}</p>
    </div>

    <div class="title">PHIEU TINH TIEN</div>

    <div class="divider"></div>

    <!-- DANH SÁCH SẢN PHẨM -->
    <table>
      <thead>
        <tr>
          <th class="text-left" style="width:50%;">SAN PHAM</th>
          <th class="text-center" style="width:20%;">SL</th>
          <th class="text-right" style="width:30%;">GIA TRI</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>

    <div class="divider"></div>

    <!-- TỔNG KẾT -->
    <div class="divider-solid"></div>

    <table class="summary-table">
      <tr class="total-row">
        <td>TONG CONG</td>
        <td class="text-right">${formatVnd(bill.totalAmount)}</td>
      </tr>
    </table>

    <div class="divider"></div>

    <!-- FOOTER -->
    <div class="footer">
      <p>Cam on quy khach va hen gap lai!</p>
      <p>Wifi: Quan Nh Moc - Pass: camonquykhach</p>
    </div>

  </div>
</body>
</html>`;
}

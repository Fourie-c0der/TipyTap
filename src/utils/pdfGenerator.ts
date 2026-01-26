// PDF generation utility
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Transaction } from '../types';
import { config } from '../constants/config';

class PDFGenerator {
  // Generate transaction statement PDF
  async generateStatement(
    transactions: Transaction[],
    startDate: Date,
    endDate: Date,
    userName: string
  ): Promise<void> {
    try {
      const html = this.createStatementHTML(transactions, startDate, endDate, userName);
      
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      // Share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Statement',
          UTI: 'com.adobe.pdf',
        });
      } else {
        console.log('Sharing is not available');
      }
    } catch (error) {
      console.error('Generate statement error:', error);
      throw new Error('Failed to generate statement');
    }
  }

  // Create HTML for statement
  private createStatementHTML(
    transactions: Transaction[],
    startDate: Date,
    endDate: Date,
    userName: string
  ): string {
    const totalIn = transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalOut = transactions
      .filter(t => t.type === 'tip' || t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0);

    const transactionRows = transactions
      .map(
        t => `
        <tr>
          <td>${new Date(t.timestamp).toLocaleDateString()}</td>
          <td>${t.type.toUpperCase()}</td>
          <td>${t.guardName || '-'}</td>
          <td style="color: ${t.type === 'deposit' ? '#4CAF50' : '#F44336'}">
            ${t.type === 'deposit' ? '+' : '-'}${config.CURRENCY_SYMBOL}${t.amount.toFixed(2)}
          </td>
          <td><span class="status-${t.status}">${t.status.toUpperCase()}</span></td>
        </tr>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Transaction Statement</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #6C63FF;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #6C63FF;
              margin: 0;
            }
            .info-section {
              margin-bottom: 30px;
              background: #f5f5f5;
              padding: 20px;
              border-radius: 8px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .summary {
              display: flex;
              justify-content: space-around;
              margin: 30px 0;
            }
            .summary-box {
              text-align: center;
              padding: 20px;
              border-radius: 8px;
              flex: 1;
              margin: 0 10px;
            }
            .summary-box.in {
              background: #E8F5E9;
              border: 2px solid #4CAF50;
            }
            .summary-box.out {
              background: #FFEBEE;
              border: 2px solid #F44336;
            }
            .summary-box h3 {
              margin: 0;
              color: #666;
              font-size: 14px;
            }
            .summary-box p {
              margin: 10px 0 0 0;
              font-size: 24px;
              font-weight: bold;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              background: #6C63FF;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: 600;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #ddd;
            }
            tr:hover {
              background: #f5f5f5;
            }
            .status-completed {
              background: #4CAF50;
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 11px;
            }
            .status-pending {
              background: #FF9800;
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 11px;
            }
            .status-failed {
              background: #F44336;
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 11px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #999;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${config.APP_NAME}</h1>
            <p>Transaction Statement</p>
          </div>

          <div class="info-section">
            <div class="info-row">
              <strong>Account Holder:</strong>
              <span>${userName}</span>
            </div>
            <div class="info-row">
              <strong>Period:</strong>
              <span>${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}</span>
            </div>
            <div class="info-row">
              <strong>Generated:</strong>
              <span>${new Date().toLocaleString()}</span>
            </div>
          </div>

          <div class="summary">
            <div class="summary-box in">
              <h3>Total Money In</h3>
              <p>+${config.CURRENCY_SYMBOL}${totalIn.toFixed(2)}</p>
            </div>
            <div class="summary-box out">
              <h3>Total Money Out</h3>
              <p>-${config.CURRENCY_SYMBOL}${totalOut.toFixed(2)}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${transactionRows}
            </tbody>
          </table>

          <div class="footer">
            <p>${config.APP_NAME} - Empowering Car Guards Across South Africa</p>
            <p>For support, contact: ${config.SUPPORT_EMAIL} | ${config.SUPPORT_PHONE}</p>
          </div>
        </body>
      </html>
    `;
  }
}

export default new PDFGenerator();
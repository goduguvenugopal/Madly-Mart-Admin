import React from 'react'

const useEmailTemplates = (cancelData) => {
  
    // cancel order email confirmation
  const cancelEmailData = {
    email: `${cancelData?.email},madlymart@gmail.com`,
    subject: `Order Cancelled - ${cancelData?.orderId}`,
    html: `
  <div style="font-family:Arial, Helvetica, sans-serif; max-width:600px; margin:0 auto; padding:20px; border:1px solid #e0e0e0; border-radius:10px; background:#ffffff; color:#333;">
    
    <!-- Header -->
    <div style="text-align:center; border-bottom:2px solid #007bff; padding-bottom:10px; margin-bottom:20px;">
      <h2 style="color:#d9534f; margin:0;">⚠️ Order Cancelled</h2>
    </div>

    <!-- Greeting -->
    <p style="font-size:15px; line-height:1.6; color:#555;">
      Dear Customer,
    </p>

    <!-- Order Info -->
    <p style="font-size:15px; line-height:1.6; color:#555;">
      Your order <b>ID: ${
        cancelData?.orderId
      }</b> has been successfully cancelled as per your request.
    </p>

    <p style="font-size:15px; line-height:1.6; color:#555;">
      <strong>Total Amount:</strong> Rs. ${cancelData?.totalAmount}
    </p>

    <!-- Details Section -->
    <h3 style="color:#007bff; margin-top:20px;">Cancellation Details</h3>
    <ul style="font-size:14px; line-height:1.6; color:#555; padding-left:20px;">
      <li><b>Cancelled On:</b> ${new Date().toLocaleString("en-GB")}</li>
      <li><b>Status:</b> Order Cancelled</li>
      <li><b>Refund:</b> Initiated (if applicable)</li>
    </ul>

    <!-- Refund Info -->
    <p style="font-size:15px; color:#555555; line-height:1.6; margin-top:20px;">
      If the payment was already completed, the refund will be processed back to your original payment method within <b>5–7 business days</b>.
    </p>

    <!-- CTA Button -->
    <div style="text-align:center; margin:30px 0;">
      <a href="https://madlymart.com/orders" 
        style="background-color:#007bff; 
               color:#ffffff; 
               padding:14px 28px; 
               font-size:16px; 
               text-decoration:none; 
               border-radius:6px; 
               display:inline-block; 
               font-weight:bold;">
        Go to My Orders
      </a>
    </div>

    <!-- Closing -->
    <p style="font-size:14px; color:#555555; line-height:1.6;">
      We’re sorry to see your order cancelled. You can always browse for other products and place a new order anytime.
    </p>

    <!-- Footer -->
    <br/>
    <p style="font-size:14px; color:#333; line-height:1.6;">
      Thank you,<br/>
      <b>Team MadlyMart</b>
    </p>
  </div>
  `,
  };

  
    return {cancelEmailData}
 
}

export default useEmailTemplates
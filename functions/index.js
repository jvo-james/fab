const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp();
const SMTP_USER=defineSecret('SMTP_USER');
const SMTP_PASS=defineSecret('SMTP_PASS');
exports.sendBookingRequestEmails=onDocumentCreated({document:'bookingRequests/{bookingId}',secrets:[SMTP_USER,SMTP_PASS]},async event=>{
 const b=event.data?.data();if(!b)return;const transport=nodemailer.createTransport({service:'gmail',auth:{user:SMTP_USER.value(),pass:SMTP_PASS.value()}});
 const summary=`Reference: ${b.reference}\nService: ${b.service}\nDate: ${b.date}\nTime: ${b.time_slot}\nRegion: ${b.region}\nAddress: ${b.address}, ${b.postcode}\nEstimated total: ${b.estimate==null?'Tailored quote':`£${Number(b.estimate).toFixed(2)}`}`;
 await Promise.all([
  transport.sendMail({from:`FAUSTINA'S SPARKLY SERVICES <${SMTP_USER.value()}>`,to:b.email,subject:`Booking request received — ${b.reference}`,text:`Hi ${b.first_name},\n\nThank you for your booking request. No payment has been taken. We will confirm availability, the final price and payment instructions within one working day.\n\n${summary}\n\nFAUSTINA'S SPARKLY SERVICES`} ),
  transport.sendMail({from:`Website bookings <${SMTP_USER.value()}>`,to:SMTP_USER.value(),replyTo:b.email,subject:`New booking request — ${b.reference}`,text:`${b.first_name} ${b.last_name}\n${b.phone}\n${b.email}\n\n${summary}\n\nNotes: ${b.notes||'None'}`})
 ]);
});

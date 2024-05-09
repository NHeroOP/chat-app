import EmailTemplate from '@/components/EmailTemplate';
import resend from '@/lib/resend';
import { ApiResponse } from '@/types/ApiResponse';


export default async function sendEmail(
  email: string,
  username: string,
  verifyToken: string,
): Promise<ApiResponse> {

  try {
    const { data, error } = await resend.emails.send({
      from: 'NHero <send@nhero.tech>',
      to: email,
      subject: "NHero Chat App Verification Code",
      react: EmailTemplate({username, otp: verifyToken}),
    });

    if (error) {
      return {success: false, message: error.message}
    }
    
    return {success: true, message: "Verification email send successfully"}  
  } 
  catch (err) {
    console.error("Error while trying to send verification email", err)
    return {success: false, message: "Failed to send verification email"}
  }

};

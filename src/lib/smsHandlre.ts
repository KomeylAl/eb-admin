export const sendSingleSms = async (text: string, phone: string) => {
  try {
    const raw = JSON.stringify({
      lineNumber: 9982005424,
      messageText: text,
      mobiles: [phone],
      sendDateTime: null,
    });

    const response = await fetch("https://api.sms.ir/v1/send/bulk", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SMSIR_API_KEY!,
        "Content-Type": "application/json",
      },
      body: raw,
    });

    if (!response.ok) {
      const data = await response.json();
      console.error("SMS API error:", data);
      return { message: data, status: response.status };
    }
    const data = await response.json();
  } catch (error) {
    return { message: `Sms sending error: ${error}`, status: 500 };
  }
};

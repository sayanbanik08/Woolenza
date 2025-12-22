export async function POST(request) {
  try {
    const { amount, currency = 'INR' } = await request.json();

    // Validate Razorpay env keys are set (helps on deployment platforms)
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay keys missing in environment');
      return NextResponse.json({ success: false, message: 'Razorpay API keys not configured on the server' }, { status: 500 });
    }

    // Validate amount
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      console.error('Invalid amount passed to create-order:', amount);
      return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 });
    }

    // instantiate Razorpay here so it uses runtime env values
    const Razorpay = (await import('razorpay')).default;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ success: true, order });
  } catch (error) {
    // Log full error on the server to help debugging
    console.error('Create-order error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
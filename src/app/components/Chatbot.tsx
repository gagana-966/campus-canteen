import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const QUICK_REPLIES = [
  "How do I login?",
  "What is the OTP code?",
  "Forgot password",
  "How to order food?",
  "Payment methods",
  "Contact support",
];

// Advanced AI response system with context awareness
function getBotResponse(userMessage: string, conversationHistory: Message[]): string {
  const lowerMessage = userMessage.toLowerCase().trim();
  const words = lowerMessage.split(' ');
  
  // Context-aware greetings with variety
  const greetingPatterns = /(^|\s)(hi|hello|hey|greetings|good morning|good afternoon|good evening|howdy|sup|yo)($|\s)/i;
  if (greetingPatterns.test(lowerMessage)) {
    const greetings = [
      "Hello! 👋 Welcome to Campus Canteen. I'm your AI assistant - I can help you with ordering, account questions, menu info, and more. What would you like to know?",
      "Hi there! 😊 Great to see you! I'm here to make your Campus Canteen experience smooth. Need help with anything?",
      "Hey! 🍽️ Welcome! I'm your personal Campus Canteen assistant. Whether you're new here or a regular, I'm happy to help. What's on your mind?",
      "Hello and welcome! I'm the Campus Canteen AI assistant. I know everything about our menu, ordering process, and services. How can I assist you today?",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // Thanks/appreciation with varied responses
  const thanksPattern = /(thank|thanks|appreciate|grateful|awesome|great|perfect|helpful)/i;
  if (thanksPattern.test(lowerMessage)) {
    const thanks = [
      "You're very welcome! 😊 Is there anything else I can help you with today?",
      "Happy to help! Feel free to ask if you have any other questions. 🙌",
      "My pleasure! I'm always here if you need assistance with anything else.",
      "Glad I could help! Don't hesitate to reach out if you need anything more. 🍽️",
      "You're welcome! Enjoy your Campus Canteen experience! 🌟",
    ];
    return thanks[Math.floor(Math.random() * thanks.length)];
  }

  // Login & Authentication
  if (/(login|log in|sign in|signin|access|authenticate)/i.test(lowerMessage)) {
    if (/(how|what|process|steps)/i.test(lowerMessage)) {
      return "Logging in is simple! Here's the process:\n\n1️⃣ Enter your email and password on the login page\n2️⃣ Click 'Sign In'\n3️⃣ You'll receive a 6-digit OTP code via email\n4️⃣ Enter the OTP to verify your account\n5️⃣ You're in! Start ordering delicious food 🍔\n\nFor demo purposes, use:\n📧 Email: demo@campus.edu\n🔑 Password: demo123\n\nNeed help with anything else?";
    }
    if (/(problem|issue|not working|can't|cannot|won't)/i.test(lowerMessage)) {
      return "Having trouble logging in? Let me help troubleshoot:\n\n✅ Check your email and password are correct\n✅ Make sure Caps Lock is off\n✅ Try clearing your browser cache\n✅ Verify your email is registered\n✅ Check your spam folder for the OTP email\n\nFor demo access, use: demo@campus.edu / demo123\n\nStill having issues? I can connect you with support!";
    }
    return "To login, simply enter your email and password, then verify with the OTP code sent to your email. First time here? You can use our demo account: demo@campus.edu with password: demo123. Let me know if you need more details!";
  }

  // OTP/Verification Code
  if (/(otp|verification|verify|code|6-digit|six digit)/i.test(lowerMessage)) {
    if (/(what|meaning|definition)/i.test(lowerMessage)) {
      return "Great question! OTP stands for 'One-Time Password' - it's a security feature. 🔐\n\nHere's how it works:\n• After you log in, we send a unique 6-digit code to your email\n• This code expires after a few minutes\n• You enter it to verify it's really you accessing the account\n• This extra layer keeps your account secure!\n\nFor demo purposes, you can use '123456' as the OTP code. It helps protect your food orders and account info! 😊";
    }
    if (/(not receive|didn't get|haven't received|missing|where)/i.test(lowerMessage)) {
      return "No OTP code yet? Here's what to do:\n\n1️⃣ Check your spam/junk folder\n2️⃣ Wait 30-60 seconds - sometimes it takes a moment\n3️⃣ Verify the email address you entered is correct\n4️⃣ Click 'Resend Code' on the verification page\n\nFor demo purposes, any 6-digit number like '123456' will work!\n\nStill not getting it? Let me know and I'll help further!";
    }
    return "The OTP (One-Time Password) is a 6-digit security code sent to your email after login. It verifies your identity and keeps your account secure. For this demo, you can use any 6-digit code like '123456' to proceed. Check your email (including spam folder) for the code!";
  }

  // Password Reset
  if (/(forgot|reset|lost|recover|change).*(password|pass)/i.test(lowerMessage)) {
    return "No worries, forgetting passwords happens to everyone! Here's how to reset it:\n\n1️⃣ Click 'Forgot password?' on the login page\n2️⃣ Enter your registered email\n3️⃣ Check your email for a reset link\n4️⃣ Click the link and create a new password\n5️⃣ Login with your new credentials!\n\nFor demo purposes, you can always use:\n📧 demo@campus.edu\n🔑 demo123\n\nNeed any other help?";
  }

  // Ordering Food - Comprehensive
  if (/(order|ordering|place order|buy|purchase|get food)/i.test(lowerMessage)) {
    if (/(how|process|steps|way)/i.test(lowerMessage)) {
      return "Ordering is super easy! Here's your step-by-step guide:\n\n1️⃣ Browse our delicious menu (Main Course, Salads, Beverages, Desserts)\n2️⃣ Use the search bar to find specific items\n3️⃣ Click '➕' to add items to your cart\n4️⃣ Adjust quantities with + and - buttons\n5️⃣ Click the cart icon to review your order\n6️⃣ Proceed to checkout\n7️⃣ Enter delivery details and special instructions\n8️⃣ Confirm your order and get your order number!\n\nYou'll get real-time updates on your order. Hungry yet? 😋";
    }
    if (/(cancel|change|modify|edit)/i.test(lowerMessage)) {
      return "Want to modify your order? Here's what you can do:\n\n✏️ Before placing: Simply update quantities in your cart or remove items\n✏️ After placing: Contact support immediately at support@campuscanteen.edu or call +91 1800-123-4567\n\n⏰ Orders can typically be modified within 5 minutes of placement. After that, our kitchen team may have already started preparing your delicious meal!\n\nNeed help with a current order?";
    }
    return "Ordering food is a breeze! Just browse our menu, add items to cart with the + button, review in the cart, and checkout. You can search for specific dishes, filter by category, and add special instructions. Each order gets a unique tracking number. Ready to explore our menu? 🍽️";
  }

  // Menu & Food Items
  if (/(menu|food|dish|item|meal|cuisine|what.*available|what.*have)/i.test(lowerMessage)) {
    if (/(recommend|suggest|best|popular|favorite)/i.test(lowerMessage)) {
      return "Great question! Our customers love these popular items:\n\n🔥 Top Picks:\n• Chicken Biryani - Aromatic and flavorful!\n• Paneer Tikka - Perfect for vegetarians\n• Caesar Salad - Fresh and healthy\n• Chocolate Brownie with Ice Cream - The ultimate dessert!\n\n🍹 Must-try Beverages:\n• Mango Lassi - Refreshing and authentic\n• Masala Chai - Perfect pick-me-up\n\nEverything is fresh and made to order. Want to know more about any specific item?";
    }
    if (/(vegetarian|veg|vegan|non-veg)/i.test(lowerMessage)) {
      return "We have excellent options for everyone! 🌱\n\n🥗 Vegetarian Favorites:\n• Paneer Tikka\n• Veg Fried Rice\n• Caesar Salad\n• Fresh Fruit Salad\n• Margherita Pizza\n\n🍖 Non-Vegetarian Options:\n• Chicken Biryani\n• Grilled Chicken Sandwich\n• Butter Chicken\n\n🌿 Vegan Options:\n• Fruit Salad\n• Selected beverages\n\nBrowse our menu and filter by category to see all options. Each item shows ingredients and dietary info!";
    }
    return "We offer a diverse menu with categories:\n\n🍛 Main Course: Biryani, Pasta, Rice dishes, and more\n🥗 Salads: Caesar, Fruit, and healthy bowls\n🥤 Beverages: Coffee, Lassi, Chai, Fresh juices\n🍰 Desserts: Cakes, Brownies, Gulab Jamun\n\nAll items are made fresh! Use the search bar to find specific dishes or browse by category. What sounds good to you?";
  }

  // Payment Methods
  if (/(payment|pay|card|upi|wallet|cash|money|price|cost)/i.test(lowerMessage)) {
    if (/(method|option|how|way)/i.test(lowerMessage)) {
      return "We accept all major payment methods for your convenience:\n\n💳 Cards: Credit & Debit (Visa, Mastercard, RuPay)\n📱 UPI: GPay, PhonePe, Paytm, BHIM\n👛 Digital Wallets: Paytm, Amazon Pay, PhonePe\n💵 Cash on Delivery: Pay when you receive\n\nAll online payments are secure and encrypted. Choose what works best for you at checkout! Prices are shown in Indian Rupees (₹).";
    }
    if (/(safe|secure|security|trust)/i.test(lowerMessage)) {
      return "Your payment security is our top priority! 🔒\n\n✅ All transactions are encrypted with SSL\n✅ We never store your card details\n✅ PCI-DSS compliant payment gateway\n✅ Instant payment confirmation\n✅ Secure OTP verification for cards\n\nYour financial information is completely safe. We partner with trusted payment providers to ensure secure transactions every time!";
    }
    return "We accept multiple payment methods: Credit/Debit cards, UPI (GPay, PhonePe, Paytm), digital wallets, and cash on delivery. All online payments are secure and encrypted. You can choose your preferred method at checkout. Prices are in Indian Rupees (₹). Any specific payment questions?";
  }

  // Delivery & Timing
  if (/(deliver|delivery|time|when|fast|quick|long|take)/i.test(lowerMessage)) {
    return "Here's what you need to know about delivery:\n\n⏱️ Average delivery time: 30-45 minutes\n🚀 Peak hours (12-2 PM, 7-9 PM): May take up to 60 minutes\n📍 Campus delivery: We cover all hostel blocks and departments\n🔔 Live tracking: You'll get real-time order status updates\n\n💡 Tip: Order during off-peak hours for faster delivery! Your order number lets you track everything. We'll notify you at each step: confirmed → preparing → out for delivery → delivered! 🎯";
  }

  // Contact & Support
  if (/(contact|support|help|customer service|call|email|phone)/i.test(lowerMessage)) {
    return "We're here to help! Contact our support team:\n\n📧 Email: support@campuscanteen.edu\n📞 Phone: +91 1800-123-4567\n⏰ Available: Monday-Saturday, 8 AM - 8 PM\n\n💬 You can also chat with me anytime! I can help with:\n• Order issues\n• Account questions\n• Menu information\n• Payment queries\n• General support\n\nWhat can I help you with right now?";
  }

  // Account Management
  if (/(account|profile|details|information|update|edit)/i.test(lowerMessage)) {
    return "Managing your account is easy! Click the User icon in the top right to:\n\n👤 View your profile information\n📧 Update email and contact details\n📍 Manage delivery addresses (with map integration!)\n📜 View order history\n💳 Saved payment methods\n🚪 Logout securely\n\nYou can also see your past orders, reorder favorites, and track current deliveries. Need help with something specific in your account?";
  }

  // Special Requests & Customization
  if (/(special|custom|customize|note|instruction|allergy|preference)/i.test(lowerMessage)) {
    return "Absolutely! We love customizing orders for you:\n\n✍️ During checkout, there's a 'Special Instructions' field where you can add:\n• Dietary preferences (less oil, no onion, etc.)\n• Allergy information\n• Spice level preferences\n• Extra items or modifications\n• Delivery instructions\n\n🍽️ Our kitchen team reads every note and does their best to accommodate. For major allergies or dietary restrictions, you can also call us directly. Your perfect meal is our priority!";
  }

  // Restaurant Partner Questions
  if (/(restaurant|partner|business|vendor|join|register as)/i.test(lowerMessage)) {
    return "Interested in joining as a restaurant partner? Great! 🤝\n\nHere's how to get started:\n1️⃣ Click 'Partner' toggle on the login page\n2️⃣ Register with your business details\n3️⃣ Access your dashboard to manage menu items\n4️⃣ Add, edit, and update food items\n5️⃣ Track orders and manage availability\n\nPartners get full control over their menu, prices, and item availability. For partnership inquiries, contact: partners@campuscanteen.edu\n\nWould you like to know more about the partner dashboard?";
  }

  // Complaints or Issues
  if (/(problem|issue|complaint|wrong|error|mistake|bad)/i.test(lowerMessage)) {
    return "I'm sorry to hear you're experiencing an issue. I'm here to help! 😊\n\nCan you tell me more about what's happening? Common issues I can help with:\n\n🔧 Login problems\n🔧 Order not received\n🔧 Payment issues\n🔧 Wrong items delivered\n🔧 Technical errors\n\nFor urgent issues, contact support immediately:\n📞 +91 1800-123-4567\n📧 support@campuscanteen.edu\n\nPlease share more details so I can assist you better!";
  }

  // Default intelligent response with context
  const messageLength = words.length;
  const hasQuestion = lowerMessage.includes('?');
  
  if (messageLength === 1 && !hasQuestion) {
    return "I'm listening! Could you tell me more about what you need help with? I can assist with orders, menu info, account questions, payments, delivery, and more. Feel free to ask anything! 😊";
  }
  
  if (hasQuestion) {
    return "That's an interesting question! I specialize in helping with:\n\n🍽️ Food ordering and menu\n🔐 Account and login help\n💳 Payment methods\n🚚 Delivery information\n📞 Contact and support\n\nCould you rephrase your question, or ask about any of these topics? I'm here to make your Campus Canteen experience amazing!";
  }
  
  // Contextual fallback based on conversation
  if (conversationHistory.length > 4) {
    return "I want to make sure I understand you correctly. Could you try rephrasing that? I'm great at helping with:\n\n• Ordering food and browsing the menu 🍔\n• Login and account issues 🔑\n• Payment options 💳\n• Delivery tracking 🚚\n• General support ❓\n\nWhat would you like to know more about?";
  }
  
  return "I'm your Campus Canteen AI assistant, and I'm here to help! I can answer questions about:\n\n🍽️ Ordering food and our menu\n🔐 Login and account management\n💳 Payment methods and security\n🚚 Delivery times and tracking\n📞 Contacting support\n\nWhat would you like to know? Feel free to ask me anything! 😊";
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your Campus Canteen assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputMessage.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Simulate bot typing and response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(messageText, messages),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 600);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg z-50 flex items-center gap-2"
          >
            <MessageCircle size={24} />
            <span className="text-sm font-medium pr-1">Need Help?</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">Campus Assistant</h3>
                  <p className="text-xs text-orange-100">Online • Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-2 max-w-[85%] ${
                      message.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === "user"
                          ? "bg-orange-500 text-white"
                          : "bg-white text-orange-500 border-2 border-orange-200"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <UserIcon size={16} />
                      ) : (
                        <Bot size={16} />
                      )}
                    </div>
                    <div>
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          message.sender === "user"
                            ? "bg-orange-500 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 px-2">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 border-t bg-white">
                <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-full transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim()}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
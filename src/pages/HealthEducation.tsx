import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Play, Clock, User, Search, Heart, Brain, Activity } from "lucide-react";
import { toast } from "sonner";

// Long-form article content keyed by article id. Used when a user opens an article.
const articleDetails: Record<string, { intro: string; sections: { heading: string; body: string; bullets?: string[] }[]; takeaway: string }> = {
  art1: {
    intro: "Cardiovascular disease causes nearly 1 in 3 deaths globally. The good news: up to 80% of premature heart attacks and strokes are preventable through everyday choices. This guide walks you through the science-backed pillars of heart health.",
    sections: [
      { heading: "1. Know Your Numbers", body: "Track these vitals every 6–12 months: blood pressure (target <120/80 mmHg), LDL cholesterol (<100 mg/dL), fasting glucose (<100 mg/dL), and waist circumference (<90 cm for men, <80 cm for women in South Asians). High blood pressure is a silent killer — at home, use a validated upper-arm BP monitor twice a week." },
      { heading: "2. Eat a Heart-Smart Diet", body: "The Mediterranean and DASH diets are the most studied for heart health.", bullets: ["Fill half your plate with vegetables and fruit at every meal", "Choose whole grains (oats, jowar, ragi, brown rice) over refined flour", "Eat fatty fish (salmon, sardines) twice a week — or 1 tbsp ground flaxseed daily for omega-3", "Cook with olive, mustard or groundnut oil; limit ghee/butter to 1 tsp/day", "Cap added salt at 5 g/day (~1 tsp); avoid pickles, papad, processed snacks", "Limit added sugar to 25 g/day (~6 tsp)"] },
      { heading: "3. Move Every Day", body: "Aim for at least 150 minutes/week of moderate aerobic activity (brisk walking, cycling, swimming) PLUS 2 sessions of strength training. Even 10-minute walks after each meal lower post-meal glucose by 20%." },
      { heading: "4. Manage Stress & Sleep", body: "Chronic stress raises cortisol and blood pressure. Practice 10 minutes of slow breathing (4 seconds in, 7 hold, 8 out) twice daily. Sleep 7–9 hours; untreated sleep apnoea triples heart-attack risk." },
      { heading: "5. Quit Tobacco, Limit Alcohol", body: "Within 1 year of quitting smoking, heart-attack risk halves. Keep alcohol below 14 units/week (men) or 7 units/week (women)." },
      { heading: "6. Warning Signs — Act FAST", body: "Call 108 immediately for chest pressure lasting >2 minutes, pain radiating to jaw/left arm, sudden breathlessness, cold sweat, or dizziness. In women, symptoms may be subtle: fatigue, nausea, upper-back pain." },
    ],
    takeaway: "Small daily habits compound into decades of healthy heart years. Start with one change this week — a 20-minute walk, swapping sugary drinks for water, or booking your annual lipid profile.",
  },
  art2: {
    intro: "1 in 7 Indians live with a mental health condition, yet fewer than 1 in 10 receive treatment. Mental illness is a medical condition — not a weakness — and modern treatments work for the vast majority of people.",
    sections: [
      { heading: "Common Conditions", body: "Anxiety disorders (panic, GAD, social anxiety), depression, OCD, PTSD, bipolar disorder and schizophrenia are the most common. Each has clear diagnostic criteria and effective treatments." },
      { heading: "Recognising the Signs", body: "Seek help if you experience for >2 weeks:", bullets: ["Persistent sadness, hopelessness or emptiness", "Loss of interest in activities you used to enjoy", "Sleep changes (insomnia or sleeping too much)", "Appetite or weight changes", "Difficulty concentrating", "Excessive worry, racing thoughts or panic attacks", "Withdrawing from family and friends", "Thoughts of self-harm or suicide (seek help TODAY)"] },
      { heading: "Treatments That Work", body: "Therapy: CBT, DBT, and IPT have decades of evidence. Medication: SSRIs and SNRIs help 60–70% of people with depression and anxiety; they are not addictive. Lifestyle: 30 min/day of exercise has antidepressant effect comparable to medication for mild depression." },
      { heading: "Breaking the Stigma", body: "Talk openly with trusted family or friends. Use 'person-first' language (a person with depression, not 'a depressive'). Educate yourself and others — myths fuel stigma." },
      { heading: "Crisis Resources (India)", body: "If you or someone you know is in crisis, please reach out NOW:", bullets: ["iCall (TISS): 9152987821 (Mon–Sat, 8AM–10PM)", "Vandrevala Foundation: 1860-2662-345 (24/7)", "AASRA: 9820466726 (24/7)", "Tele-MANAS (Govt of India): 14416 (24/7)"] },
    ],
    takeaway: "Reaching out for help is a sign of strength. With the right care, recovery is the rule — not the exception.",
  },
  art3: {
    intro: "Diabetes affects over 100 million Indians. Good control means an HbA1c under 7%, which dramatically lowers your risk of heart disease, kidney failure, blindness and amputation.",
    sections: [
      { heading: "Daily Self-Care Checklist", body: "Build these into your routine:", bullets: ["Check fasting and post-meal glucose as prescribed", "Take medications/insulin on time — never skip doses", "Eat 3 meals + 2 small snacks at regular times", "Walk 30 minutes after the heaviest meal", "Inspect feet for cuts, blisters or colour change", "Drink 2–3 litres of water (unless restricted)"] },
      { heading: "What to Eat", body: "Aim for a low-glycaemic plate: 1/2 non-starchy vegetables, 1/4 lean protein (dal, egg, fish, chicken, paneer), 1/4 whole grain (brown rice, jowar, oats). Avoid sugary drinks, sweets, refined flour, fried snacks and white rice in excess. Replace sugar with stevia or use small amounts of jaggery." },
      { heading: "Recognising Highs and Lows", body: "HYPERglycaemia (high): excessive thirst, frequent urination, blurred vision, fatigue → take prescribed insulin and water. HYPOglycaemia (low <70 mg/dL): shaking, sweating, hunger, confusion → take 15 g fast sugar (3 glucose tablets, 1/2 cup juice, 1 tbsp honey), retest in 15 minutes." },
      { heading: "Tests You Need", body: "HbA1c every 3 months, lipid profile every 6 months, microalbumin urine test yearly, dilated eye exam yearly, foot exam at every visit, ECG yearly after age 40." },
      { heading: "Insulin Tips", body: "Rotate injection sites (abdomen, thigh, upper arm) to prevent lipohypertrophy. Store unopened pens in the fridge; in-use pens at room temperature for up to 28 days. Carry a glucose-tablet pack everywhere." },
    ],
    takeaway: "Diabetes is a marathon, not a sprint. Consistency in diet, exercise and medication keeps you healthy for decades.",
  },
  art4: {
    intro: "The monsoon is beautiful but brings a sharp rise in dengue, malaria, chikungunya, typhoid, hepatitis A, leptospirosis and viral fevers. A few precautions can keep your family safe.",
    sections: [
      { heading: "Stop Mosquitoes Breeding at Home", body: "", bullets: ["Empty water from flower pots, coolers, buckets, tyres EVERY week", "Cover overhead tanks tightly", "Use mosquito nets at night; window mesh screens by day", "Apply DEET 20% or picaridin repellent on exposed skin", "Wear full-sleeve clothing at dawn and dusk (peak Aedes activity)"] },
      { heading: "Safe Food & Water", body: "", bullets: ["Drink only boiled (10 min rolling boil) or RO-filtered water", "Avoid roadside cut fruits, juices and chaat", "Eat freshly cooked, hot food — avoid leftovers >4 hours old", "Wash vegetables in salt water for 10 minutes", "Wash hands with soap for 20 seconds before meals and after toilet"] },
      { heading: "Recognise Warning Signs", body: "DENGUE: sudden high fever, severe body ache ('break-bone'), retro-orbital pain, rash, low platelets. MALARIA: cyclical fever with chills, sweating, headache. TYPHOID: step-ladder fever, abdominal pain, rose spots, slow pulse. SEEK CARE if fever >2 days, persistent vomiting, bleeding gums, severe abdominal pain, or reduced urine output." },
      { heading: "Do NOT Self-Medicate", body: "Never take aspirin or ibuprofen for monsoon fever — they worsen dengue bleeding. Only take paracetamol (max 4 g/day adults) and consult a doctor for diagnosis." },
    ],
    takeaway: "Prevention is cheaper than ICU. A 10-minute weekly home check stops 90% of mosquito breeding.",
  },
  art5: {
    intro: "Vaccines have eliminated smallpox and made polio a memory. India's Universal Immunisation Programme protects children against 12 deadly diseases — free of cost at any government facility.",
    sections: [
      { heading: "Birth", body: "BCG (TB), OPV-0 (polio), Hepatitis B birth dose. Given within 24 hours." },
      { heading: "6, 10 and 14 Weeks", body: "Pentavalent (DPT + Hep-B + Hib), OPV, Rotavirus, Fractional IPV, PCV (Pneumococcal). One visit at each age. Mild fever for 24 h is normal — give paracetamol drops as advised." },
      { heading: "9–12 Months", body: "Measles–Rubella (MR-1), JE-1 (in endemic states), Vitamin A first dose, PCV booster." },
      { heading: "16–24 Months", body: "DPT booster-1, OPV booster, MR-2, JE-2, Vitamin A 2nd dose." },
      { heading: "5–6 Years", body: "DPT booster-2. Then Td at 10 and 16 years." },
      { heading: "Optional (Recommended)", body: "Influenza (yearly after 6 months), Hepatitis A (2 doses), Typhoid conjugate, Varicella (chickenpox), HPV (girls 9–14 years)." },
    ],
    takeaway: "Keep the immunisation card safe; download CoWIN/U-WIN digital certificates. Never delay scheduled doses — every missed week increases risk.",
  },
  art6: {
    intro: "Healthy eating is not expensive — it's a matter of smart choices. You can feed a family of 4 nutritiously for under ₹300/day in India.",
    sections: [
      { heading: "Plan & Shop Weekly", body: "Make a 7-day meal plan; buy only what you'll use. Shop the perimeter of the supermarket (fresh produce, dairy) and avoid the packaged aisles." },
      { heading: "Cheapest Sources of Each Nutrient", body: "", bullets: ["Protein: dals (₹120/kg), eggs (₹6 each), soya chunks, peanuts, curd", "Iron: ragi, jaggery, spinach, dates, sprouted moong", "Calcium: curd, ragi, til (sesame), milk", "Omega-3: flaxseed (₹100/kg), walnuts, sardines", "Vitamin C: amla, guava, lemon, capsicum"] },
      { heading: "Batch-Cook on Sunday", body: "Cook 1 kg dal, chop a week's vegetables, boil eggs for the week, prep chutneys. Saves 10 hours and ₹500/week vs. ordering food." },
      { heading: "Healthy Swaps", body: "Maida → atta or ragi flour; sugar → 70% reduced jaggery; soft drinks → nimbu pani; chips → roasted chana; biscuits → fruit and nuts." },
    ],
    takeaway: "A balanced plate (½ veg, ¼ grain, ¼ protein) at every meal beats any superfood or supplement.",
  },
  art7: {
    intro: "Pregnancy lasts about 40 weeks, split into three trimesters. Each stage has its own needs, tests and warning signs. With good care, 95% of pregnancies in India end in a healthy delivery.",
    sections: [
      { heading: "1st Trimester (Weeks 1–13)", body: "Confirm pregnancy with urine test + USG. Start folic acid 400–800 µg/day (prevents neural-tube defects). Avoid alcohol, smoking, X-rays, raw fish, soft cheese. Common symptoms: nausea, fatigue, breast tenderness. Tests: blood group, Hb, HIV, HBsAg, VDRL, TSH, dating scan at 8–12 weeks, NT scan at 11–13 weeks." },
      { heading: "2nd Trimester (Weeks 14–27)", body: "Energy returns; baby's kicks felt around week 18–22. Add iron + calcium tablets after week 14. Eat extra 340 kcal/day (a glass of milk + 1 banana + 1 boiled egg). Tests: anomaly scan (18–22 wk), GTT for gestational diabetes (24–28 wk), Tdap vaccine." },
      { heading: "3rd Trimester (Weeks 28–40)", body: "Visits become weekly after week 36. Monitor fetal movements (≥10 kicks in 2 hours). Pack hospital bag by week 36. Tests: growth scans, Group B Strep swab (35–37 wk). Practice breathing for labour." },
      { heading: "Warning Signs — Call Doctor Immediately", body: "", bullets: ["Vaginal bleeding or fluid leak", "Severe headache, blurred vision, swelling of hands/face (pre-eclampsia)", "Reduced fetal movements", "Fever >100°F", "Severe abdominal pain"] },
    ],
    takeaway: "Attend every antenatal visit, take supplements daily, and don't ignore unusual symptoms. You are growing a human — be kind to yourself.",
  },
  art8: {
    intro: "A stroke kills 1.9 million brain cells every minute. Recognising it and getting to hospital within the 4.5-hour 'golden window' can mean the difference between recovery and lifelong disability.",
    sections: [
      { heading: "The FAST Rule", body: "", bullets: ["F — FACE: Ask the person to smile. Does one side droop?", "A — ARMS: Ask them to raise both arms. Does one drift down?", "S — SPEECH: Ask them to repeat a simple sentence. Is it slurred or strange?", "T — TIME: If ANY sign is present, note the exact time and call 108 immediately."] },
      { heading: "Other Warning Signs", body: "Sudden numbness on one side, sudden confusion, sudden loss of vision in one or both eyes, sudden severe headache ('worst of my life'), sudden difficulty walking or loss of balance." },
      { heading: "What to Do While Waiting", body: "Lay the person on their side, head slightly raised. Loosen tight clothes. Do NOT give food, water or aspirin — they may choke or worsen bleeding strokes. Note medications they take." },
      { heading: "Why Time Matters", body: "Clot-busting drugs (tPA) work best within 4.5 hours. Mechanical clot retrieval works up to 24 hours in some cases. The earlier you reach a stroke-ready hospital, the better the outcome." },
      { heading: "Prevention", body: "Control BP <130/80, manage diabetes, treat atrial fibrillation, don't smoke, walk 30 min/day, eat Mediterranean diet, take statins if prescribed." },
    ],
    takeaway: "Memorise FAST. Share it with family. One day it may save a life.",
  },
  art9: {
    intro: "Adults need 7–9 hours of sleep. Chronic short sleep raises risk of obesity, diabetes, heart disease, depression and dementia. Sleep hygiene is the cheapest medicine.",
    sections: [
      { heading: "Build a Sleep-Friendly Routine", body: "", bullets: ["Same bedtime and wake time — even on weekends (±30 min)", "Get 10 min of morning sunlight to anchor your body clock", "Stop caffeine after 2 PM (it has a 6-hour half-life)", "No heavy meals or alcohol within 3 hours of bed", "Dim lights and avoid screens 1 hour before bed (blue light suppresses melatonin)"] },
      { heading: "Optimise the Bedroom", body: "Keep it cool (18–22°C), dark (blackout curtains), quiet (earplugs or white noise), and screen-free. Use the bed only for sleep — not work or TV." },
      { heading: "When Your Mind Races", body: "Try 4-7-8 breathing: inhale 4 sec, hold 7 sec, exhale 8 sec — repeat 4 times. Or write tomorrow's worries in a notebook 1 hour before bed." },
      { heading: "If You Can't Sleep", body: "After 20 minutes awake, get out of bed, do something boring under dim light, and return when sleepy. Don't watch the clock." },
      { heading: "See a Doctor If", body: "You snore loudly with gasps (sleep apnoea), feel sleepy despite 8 hours in bed, or take >30 min to fall asleep most nights for >3 months." },
    ],
    takeaway: "Treat sleep as non-negotiable — it's when your brain detoxes, your heart rests and memories consolidate.",
  },
  art10: {
    intro: "A well-stocked first-aid kit lets you handle minor injuries instantly and stabilise serious ones until help arrives. Build one for each home, car and travel bag.",
    sections: [
      { heading: "Wound Care", body: "", bullets: ["Antiseptic liquid (Savlon/Betadine)", "Sterile gauze pads (4×4 inch)", "Bandages — adhesive (Band-Aid) in 3 sizes", "Crepe bandage 4-inch and 6-inch", "Sterile cotton roll", "Adhesive tape (Micropore)", "Tweezers and scissors", "Disposable gloves (nitrile, 2 pairs)"] },
      { heading: "Medications", body: "", bullets: ["Paracetamol 500 mg (pain, fever)", "Ibuprofen 400 mg (inflammation — not for kids <12 or dengue)", "Antihistamine (Cetirizine 10 mg)", "ORS sachets ×5", "Antacid tablets", "Antiseptic cream (Soframycin)", "Burn ointment (Silverex)", "Hydrocortisone 1% cream (rashes)", "Anti-diarrhoeal (Loperamide) — adults only"] },
      { heading: "Diagnostic Tools", body: "Digital thermometer, BP monitor, pulse oximeter, blood-glucose meter (if diabetic), torch with spare batteries." },
      { heading: "Emergency Items", body: "Emergency contact list, list of family allergies and chronic medications, blood-group card, insurance card photocopy, ₹500 emergency cash." },
      { heading: "Maintenance", body: "Check the kit every 6 months. Replace expired medications. Restock after every use. Keep in a clearly labelled box accessible to all adults — but locked away from children." },
    ],
    takeaway: "A first-aid kit you never use is a kit that worked — by being ready. Build yours this weekend.",
  },
};

const healthArticles = [
  {
    id: "art1",
    title: "Understanding Heart Health: Prevention Tips",
    category: "Cardiology",
    author: "Dr. Sarah Johnson",
    readTime: "5 min read",
    date: "2024-01-15",
    image: "/api/placeholder/300/200",
    excerpt: "Learn essential tips for maintaining a healthy heart and preventing cardiovascular diseases through lifestyle changes and regular checkups.",
    content: "Heart disease remains one of the leading causes of death globally. However, many heart conditions can be prevented through simple lifestyle modifications: a Mediterranean-style diet rich in fruits, vegetables, whole grains and healthy fats; at least 150 minutes of moderate aerobic activity per week; not smoking; managing stress through meditation or breathing exercises; keeping blood pressure under 120/80 and cholesterol within healthy ranges. Schedule a lipid profile and ECG every 12 months after age 35."
  },
  {
    id: "art2",
    title: "Mental Health Awareness: Breaking the Stigma",
    category: "Mental Health",
    author: "Dr. Michael Chen",
    readTime: "7 min read",
    date: "2024-01-12",
    image: "/api/placeholder/300/200",
    excerpt: "Understanding mental health conditions and how to seek help without stigma. A comprehensive guide to mental wellness.",
    content: "Mental health is just as important as physical health. Common conditions include anxiety, depression, PTSD and bipolar disorder. Warning signs: persistent sadness >2 weeks, withdrawal from activities, sleep changes, appetite changes, thoughts of self-harm. Treatments work: therapy (CBT, DBT), medications, lifestyle change, and peer support. If you or someone you know is in crisis, call iCall: 9152987821 (India) or Vandrevala Foundation: 1860-2662-345."
  },
  {
    id: "art3",
    title: "Diabetes Management: Daily Care Tips",
    category: "Endocrinology",
    author: "Dr. Emily Davis",
    readTime: "6 min read",
    date: "2024-01-10",
    image: "/api/placeholder/300/200",
    excerpt: "Practical tips for managing diabetes through diet, exercise, and medication adherence.",
    content: "Living with diabetes requires consistent daily management. Check blood sugar as prescribed, take medications on time, eat balanced meals at regular intervals, walk 30 minutes daily, monitor feet for cuts, and have an HbA1c test every 3 months. Keep glucose tablets nearby for hypoglycemia."
  },
  {
    id: "art4",
    title: "Monsoon Season: Preventing Dengue, Malaria and Typhoid",
    category: "General Medicine",
    author: "Dr. Rajesh Kumar",
    readTime: "4 min read",
    date: "2024-06-05",
    image: "/api/placeholder/300/200",
    excerpt: "Stay safe this monsoon — eliminate stagnant water, drink boiled water, and recognize early symptoms of vector-borne diseases.",
    content: "Empty water containers weekly, use mosquito repellents and nets, eat freshly cooked food, drink only boiled or filtered water, and avoid roadside cut fruits. Seek medical care for high fever, body aches, rash or persistent vomiting."
  },
  {
    id: "art5",
    title: "Childhood Vaccination Schedule (0–5 years)",
    category: "Pediatrics",
    author: "Dr. Priya Sharma",
    readTime: "6 min read",
    date: "2024-04-22",
    image: "/api/placeholder/300/200",
    excerpt: "A complete guide to the Indian National Immunisation Schedule for infants and toddlers.",
    content: "At birth: BCG, OPV-0, Hep-B. 6/10/14 weeks: DPT, OPV, Hep-B, Hib, Rotavirus, PCV. 9 months: Measles-Rubella, Vitamin A. 16–24 months: DPT booster, OPV booster, MR-2. Keep your child's immunisation card updated."
  },
  {
    id: "art6",
    title: "Healthy Eating on a Budget",
    category: "Nutrition",
    author: "Chef Maria Rodriguez",
    readTime: "5 min read",
    date: "2024-03-18",
    image: "/api/placeholder/300/200",
    excerpt: "Affordable swaps and meal-prep ideas for nutritious eating without overspending.",
    content: "Buy seasonal vegetables, choose dals and millets over packaged proteins, batch-cook on weekends, freeze leftovers, and avoid sugary drinks. A balanced plate: 1/2 vegetables, 1/4 whole grain, 1/4 protein."
  },
  {
    id: "art7",
    title: "Pregnancy Care: Trimester-by-Trimester Guide",
    category: "Gynecology",
    author: "Dr. Neha Reddy",
    readTime: "8 min read",
    date: "2024-05-10",
    image: "/api/placeholder/300/200",
    excerpt: "What to expect, eat, and avoid during each stage of pregnancy.",
    content: "1st trimester: folic acid, avoid alcohol/smoking, first ultrasound at 8–12 weeks. 2nd trimester: anomaly scan at 18–22 weeks, iron and calcium supplements. 3rd trimester: birth plan, kick-count monitoring, weekly checkups after 36 weeks."
  },
  {
    id: "art8",
    title: "Recognising a Stroke: Use the FAST Rule",
    category: "Neurology",
    author: "Dr. Ravi Iyer",
    readTime: "3 min read",
    date: "2024-02-14",
    image: "/api/placeholder/300/200",
    excerpt: "FAST = Face drooping, Arm weakness, Speech difficulty, Time to call emergency.",
    content: "Every minute counts in a stroke. If you see Face drooping, Arm weakness, or Speech slurring, note the Time and call emergency immediately. Clot-busting drugs work best within 4.5 hours of onset."
  },
  {
    id: "art9",
    title: "Improving Sleep Hygiene for Better Health",
    category: "Mental Health",
    author: "Dr. James Park",
    readTime: "4 min read",
    date: "2024-01-30",
    image: "/api/placeholder/300/200",
    excerpt: "Simple evening habits to fall asleep faster and wake refreshed.",
    content: "Keep a consistent sleep schedule, limit screens 1 hour before bed, avoid caffeine after 2 PM, keep the bedroom cool and dark, and try 4-7-8 breathing if your mind races."
  },
  {
    id: "art10",
    title: "Home First-Aid Kit Essentials",
    category: "General Medicine",
    author: "Dr. Teja",
    readTime: "4 min read",
    date: "2024-06-01",
    image: "/api/placeholder/300/200",
    excerpt: "Build a complete home first-aid kit for common injuries and emergencies.",
    content: "Must-haves: antiseptic liquid, gauze, bandages of various sizes, sterile cotton, adhesive tape, scissors, thermometer, BP monitor, ORS sachets, paracetamol, antihistamine, oral rehydration salts, and a torch. Check expiry dates every 6 months."
  }
];

const healthVideos = [
  {
    id: "vid1",
    title: "10-Minute Morning Exercise Routine",
    category: "Fitness",
    duration: "10:23",
    instructor: "Lisa Wilson, PT",
    views: "12.5K",
    thumbnail: "/api/placeholder/300/200",
    description: "Start your day with this energizing 10-minute workout routine designed for all fitness levels."
  },
  {
    id: "vid2",
    title: "Breathing Techniques for Stress Relief",
    category: "Mental Health",
    duration: "8:15",
    instructor: "Dr. James Park",
    views: "8.2K",
    thumbnail: "/api/placeholder/300/200",
    description: "Learn effective breathing techniques to manage stress and anxiety in your daily life."
  },
  {
    id: "vid3",
    title: "Healthy Meal Prep for Busy Professionals",
    category: "Nutrition",
    duration: "15:30",
    instructor: "Chef Maria Rodriguez",
    views: "25.1K",
    thumbnail: "/api/placeholder/300/200",
    description: "Time-saving meal prep strategies for maintaining a healthy diet with a busy schedule."
  },
  { id: "vid4", title: "CPR Basics — Hands-Only Technique", category: "First Aid", duration: "6:48", instructor: "Dr. Teja", views: "47.2K", thumbnail: "/api/placeholder/300/200", description: "Learn the rhythm and depth of chest compressions to save a life." },
  { id: "vid5", title: "Yoga for Lower Back Pain", category: "Fitness", duration: "20:15", instructor: "Asha Iyer, RYT", views: "33.8K", thumbnail: "/api/placeholder/300/200", description: "Gentle yoga poses to relieve chronic lower back pain." },
  { id: "vid6", title: "Diabetic-Friendly Indian Recipes", category: "Nutrition", duration: "12:05", instructor: "Chef Maria Rodriguez", views: "18.9K", thumbnail: "/api/placeholder/300/200", description: "Tasty diabetic-friendly Indian meals under 400 calories." },
  { id: "vid7", title: "Postpartum Recovery Exercises", category: "Gynecology", duration: "14:30", instructor: "Dr. Neha Reddy", views: "9.6K", thumbnail: "/api/placeholder/300/200", description: "Safe exercises for new mothers in the first 6 weeks." },
  { id: "vid8", title: "Mindfulness for Anxiety Relief", category: "Mental Health", duration: "10:00", instructor: "Dr. James Park", views: "27.3K", thumbnail: "/api/placeholder/300/200", description: "A 10-minute guided mindfulness practice for anxiety." }
];

const healthTips = [
  {
    id: "tip1",
    title: "Stay Hydrated",
    icon: Activity,
    tip: "Drink at least 8 glasses of water daily to maintain optimal body function and energy levels.",
    category: "General Health"
  },
  {
    id: "tip2",
    title: "Regular Exercise",
    icon: Heart,
    tip: "Aim for at least 30 minutes of moderate exercise 5 days a week to improve cardiovascular health.",
    category: "Fitness"
  },
  {
    id: "tip3",
    title: "Adequate Sleep",
    icon: Brain,
    tip: "Get 7-9 hours of quality sleep each night to support mental health and immune function.",
    category: "Sleep Health"
  },
  { id: "tip4", title: "Wash Hands Often", icon: Activity, tip: "Wash hands with soap for at least 20 seconds before meals and after returning home.", category: "Hygiene" },
  { id: "tip5", title: "Limit Salt & Sugar", icon: Heart, tip: "Keep added salt under 5g/day and added sugar under 25g/day to protect your heart and kidneys.", category: "Nutrition" },
  { id: "tip6", title: "Annual Health Check", icon: Activity, tip: "Schedule a full body check-up once a year — early detection saves lives.", category: "Preventive Care" },
  { id: "tip7", title: "Sun Safety", icon: Activity, tip: "Use SPF 30+ sunscreen and avoid direct sun between 11 AM and 4 PM.", category: "Skin Care" },
  { id: "tip8", title: "Mind Your Posture", icon: Brain, tip: "Take a 2-minute stretch break every hour if you work at a desk.", category: "Ergonomics" }
];

export default function HealthEducation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<typeof healthArticles[0] | null>(null);

  const categories = ["all", "Cardiology", "Mental Health", "Endocrinology", "Fitness", "Nutrition", "General Medicine", "Pediatrics", "Gynecology", "Neurology", "First Aid"];

  const filteredArticles = healthArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-light via-background to-medical-muted">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="outline" 
            onClick={() => setSelectedArticle(null)}
            className="mb-6"
          >
            ← Back to Articles
          </Button>
          
          <Card>
            <CardHeader>
              <Badge variant="outline" className="w-fit mb-2">
                {selectedArticle.category}
              </Badge>
              <CardTitle className="text-3xl">{selectedArticle.title}</CardTitle>
              <CardDescription className="flex items-center gap-4 text-base">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {selectedArticle.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedArticle.readTime}
                </span>
                <span>{selectedArticle.date}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-lg text-muted-foreground mb-6">
                  {selectedArticle.excerpt}
                </p>
                <div className="text-foreground">
                  {selectedArticle.content}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light via-background to-medical-muted">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Health Education</h1>
          <p className="text-muted-foreground">Learn about health topics from our medical experts</p>
        </div>

        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search articles, videos, and tips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "All Categories" : category}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="tips">Health Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Badge variant="outline" className="w-fit mb-2">
                      {article.category}
                    </Badge>
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {article.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedArticle(article)}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Article
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthVideos.map((video) => (
                <Card key={video.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="relative">
                      <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Play className="h-12 w-12 text-gray-400" />
                      </div>
                      <Badge variant="secondary" className="absolute bottom-2 right-2">
                        {video.duration}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="mb-2">
                      {video.category}
                    </Badge>
                    <CardTitle className="text-lg mb-2">{video.title}</CardTitle>
                    <CardDescription className="mb-3">
                      {video.description}
                    </CardDescription>
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                      <span>{video.instructor}</span>
                      <span>{video.views} views</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info(`Playing: ${video.title} (${video.duration})`)}>
                      <Play className="h-4 w-4 mr-2" />
                      Watch Video
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthTips.map((tip) => (
                <Card key={tip.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-medical-primary/10 rounded-lg">
                        <tip.icon className="h-6 w-6 text-medical-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tip.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {tip.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tip.tip}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
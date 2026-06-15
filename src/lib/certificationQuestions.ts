import { CertificationType } from "@/types/game";

export interface CertificationQuestion {
  id: string;
  domain: string;
  question: string;
  options: { id: string; text: string; correct: boolean; explanation: string }[];
}

export function getRandomQuestions(
  questions: CertificationQuestion[],
  count: number
): CertificationQuestion[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

const awsDeveloperQuestions: CertificationQuestion[] = [
  {
    id: "aws1",
    domain: "Compute",
    question: "Which AWS service is a fully managed compute platform that helps you run and scale containerized applications?",
    options: [
      { id: "a", text: "Amazon EC2", correct: false, explanation: "EC2 is virtual servers, not specifically for containerized apps." },
      { id: "b", text: "AWS Lambda", correct: false, explanation: "Lambda is serverless functions, not containers." },
      { id: "c", text: "Amazon ECS", correct: true, explanation: "ECS (Elastic Container Service) is designed for running containerized applications." },
      { id: "d", text: "Amazon Batch", correct: false, explanation: "Batch is for batch computing workloads." },
    ],
  },
  {
    id: "aws2",
    domain: "Storage",
    question: "Which S3 storage class is designed for data that is accessed infrequently but requires rapid access when needed?",
    options: [
      { id: "a", text: "S3 Standard", correct: false, explanation: "Standard is for frequently accessed data." },
      { id: "b", text: "S3 Intelligent-Tiering", correct: false, explanation: "Intelligent-Tiering automatically moves data between tiers." },
      { id: "c", text: "S3 Standard-IA", correct: true, explanation: "Standard-IA (Infrequent Access) is for data accessed infrequently but needing fast retrieval." },
      { id: "d", text: "S3 Glacier", correct: false, explanation: "Glacier is for archival data with retrieval times of minutes to hours." },
    ],
  },
  {
    id: "aws3",
    domain: "Security",
    question: "Which AWS service provides centralized security and compliance management across your AWS environment?",
    options: [
      { id: "a", text: "AWS IAM", correct: false, explanation: "IAM handles identity and access management but not compliance." },
      { id: "b", text: "AWS Config", correct: false, explanation: "Config tracks configuration changes but doesn't provide security management." },
      { id: "c", text: "AWS Security Hub", correct: true, explanation: "Security Hub provides a comprehensive view of security and compliance status." },
      { id: "d", text: "AWS CloudTrail", correct: false, explanation: "CloudTrail logs API activity but doesn't provide centralized security management." },
    ],
  },
  {
    id: "aws4",
    domain: "Database",
    question: "Which AWS database service is a fully managed relational database that supports PostgreSQL, MySQL, MariaDB, and Oracle?",
    options: [
      { id: "a", text: "Amazon DynamoDB", correct: false, explanation: "DynamoDB is a NoSQL database." },
      { id: "b", text: "Amazon RDS", correct: true, explanation: "RDS (Relational Database Service) supports multiple SQL database engines." },
      { id: "c", text: "Amazon Redshift", correct: false, explanation: "Redshift is a data warehouse service." },
      { id: "d", text: "Amazon DocumentDB", correct: false, explanation: "DocumentDB is a MongoDB-compatible document database." },
    ],
  },
  {
    id: "aws5",
    domain: "Networking",
    question: "What is the maximum number of VPCs that can be created per AWS region?",
    options: [
      { id: "a", text: "5", correct: false, explanation: "The default quota is higher than 5." },
      { id: "b", text: "20", correct: false, explanation: "This is too low for production use." },
      { id: "c", text: "100", correct: true, explanation: "The default quota is 100 VPCs per region." },
      { id: "d", text: "Unlimited", correct: false, explanation: "There is a limit that can be increased via support." },
    ],
  },
];

const rnLicenseQuestions: CertificationQuestion[] = [
  {
    id: "rn1",
    domain: "Patient Care",
    question: "Which vital sign should be assessed first in an emergency situation?",
    options: [
      { id: "a", text: "Blood pressure", correct: false, explanation: "While important, breathing comes first in emergencies." },
      { id: "b", text: "Respirations", correct: true, explanation: "Airway and breathing (ABCs) take priority in emergencies." },
      { id: "c", text: "Temperature", correct: false, explanation: "Temperature is not a priority in acute emergencies." },
      { id: "d", text: "Pulse", correct: false, explanation: "Circulation comes after airway and breathing." },
    ],
  },
  {
    id: "rn2",
    domain: "Medication",
    question: "What are the 5 Rights of Medication Administration?",
    options: [
      { id: "a", text: "Right patient, drug, dose, route, time", correct: true, explanation: "The 5 Rights ensure safe medication administration." },
      { id: "b", text: "Right patient, drug, dose, time, documentation", correct: false, explanation: "Route (not documentation) is the 4th Right." },
      { id: "c", text: "Right patient, drug, dose, route, consent", correct: false, explanation: "Time (not consent) is the 5th Right." },
      { id: "d", text: "Right patient, drug, dose, time, reason", correct: false, explanation: "Route is required; reason is not one of the 5 Rights." },
    ],
  },
  {
    id: "rn3",
    domain: "Triage",
    question: "Which patient should be prioritized first in triage?",
    options: [
      { id: "a", text: "Patient with minor laceration", correct: false, explanation: "Minor injuries are lower priority." },
      { id: "b", text: "Patient with chest pain and shortness of breath", correct: true, explanation: "Potential cardiac event is high priority." },
      { id: "c", text: "Patient with sprained ankle", correct: false, explanation: "Minor orthopedic injuries are low priority." },
      { id: "d", text: "Patient requesting prescription refill", correct: false, explanation: "Routine requests are not emergent." },
    ],
  },
  {
    id: "rn4",
    domain: "Ethics",
    question: "What is the primary ethical principle in nursing care?",
    options: [
      { id: "a", text: "Autonomy", correct: false, explanation: "Autonomy is important but beneficence comes first." },
      { id: "b", text: "Beneficence", correct: true, explanation: "Doing good and promoting patient wellbeing is primary." },
      { id: "c", text: "Justice", correct: false, explanation: "Justice relates to fairness in resource distribution." },
      { id: "d", text: "Non-maleficence", correct: false, explanation: "Do no harm, but beneficence (doing good) is primary." },
    ],
  },
  {
    id: "rn5",
    domain: "Documentation",
    question: "What is the most important rule of patient documentation?",
    options: [
      { id: "a", text: "Use abbreviations to save time", correct: false, explanation: "Abbreviations can lead to errors and misinterpretation." },
      { id: "b", text: "Document objectively and factually", correct: true, explanation: "Objective, factual documentation is legally essential." },
      { id: "c", text: "Document only significant events", correct: false, explanation: "All care and assessments should be documented." },
      { id: "d", text: "Document at the end of the shift", correct: false, explanation: "Documentation should be done as close to real-time as possible." },
    ],
  },
];

const peLicenseQuestions: CertificationQuestion[] = [
  {
    id: "pe1",
    domain: "Structural",
    question: "What is the maximum allowable deflection for a floor joist under live load?",
    options: [
      { id: "a", text: "L/180", correct: false, explanation: "This is for roof live load deflection." },
      { id: "b", text: "L/240", correct: false, explanation: "This is for total load deflection." },
      { id: "c", text: "L/360", correct: true, explanation: "L/360 is the standard for floor joist live load deflection." },
      { id: "d", text: "L/480", correct: false, explanation: "This is too conservative for typical floor joists." },
    ],
  },
  {
    id: "pe2",
    domain: "Ethics",
    question: "What is the fundamental canon of the NSPE Code of Ethics?",
    options: [
      { id: "a", text: "Engineers shall maximize profit for clients", correct: false, explanation: "Profit is not the primary canon." },
      { id: "b", text: "Engineers shall hold paramount public safety", correct: true, explanation: "Public safety, health, and welfare are paramount." },
      { id: "c", text: "Engineers shall work in their area of competence", correct: false, explanation: "This is a rule, not the fundamental canon." },
      { id: "d", text: "Engineers shall avoid conflicts of interest", correct: false, explanation: "This is important but not the fundamental canon." },
    ],
  },
  {
    id: "pe3",
    domain: "Design",
    question: "What is the minimum concrete cover for #6 rebar in a cast-in-place slab exposed to weather?",
    options: [
      { id: "a", text: "0.75 inches", correct: false, explanation: "Minimum is 0.75 but more is required for weather exposure." },
      { id: "b", text: "1.0 inches", correct: false, explanation: "This is for slabs not exposed to weather." },
      { id: "c", text: "1.5 inches", correct: true, explanation: "1.5 inches minimum for #6 rebar exposed to weather." },
      { id: "d", text: "2.0 inches", correct: false, explanation: "This is for larger bars or severe exposure." },
    ],
  },
  {
    id: "pe4",
    domain: "Materials",
    question: "What is the yield strength of A992 structural steel?",
    options: [
      { id: "a", text: "36 ksi", correct: false, explanation: "This is for A36 steel." },
      { id: "b", text: "50 ksi", correct: true, explanation: "A992 is the most common structural steel with 50 ksi yield." },
      { id: "c", text: "65 ksi", correct: false, explanation: "This is for high-strength steel." },
      { id: "d", text: "70 ksi", correct: false, explanation: "This exceeds common structural steel grades." },
    ],
  },
  {
    id: "pe5",
    domain: "Analysis",
    question: "For a simply supported beam with uniform load, where does maximum moment occur?",
    options: [
      { id: "a", text: "At the supports", correct: false, explanation: "Moment is zero at simple supports." },
      { id: "b", text: "At midspan", correct: true, explanation: "Maximum moment is at midspan for uniform load." },
      { id: "c", text: "At quarter points", correct: false, explanation: "Moment is less than maximum at quarter points." },
      { id: "d", text: "Varies with load intensity", correct: false, explanation: "For uniform load, maximum is always at midspan." },
    ],
  },
];

const teachingLicenseQuestions: CertificationQuestion[] = [
  {
    id: "t1",
    domain: "Instruction",
    question: "Which approach best supports differentiated instruction?",
    options: [
      { id: "a", text: "One-size-fits-all teaching", correct: false, explanation: "Differentiated instruction requires varied approaches." },
      { id: "b", text: "Identifying and addressing individual learning needs", correct: true, explanation: "Differentiation requires understanding individual differences." },
      { id: "c", text: "Teaching only to the middle of the class", correct: false, explanation: "This leaves advanced and struggling students behind." },
      { id: "d", text: "Lecture-based instruction for all topics", correct: false, explanation: "Lectures alone don't differentiate for diverse learners." },
    ],
  },
  {
    id: "t2",
    domain: "Assessment",
    question: "What is the purpose of formative assessment?",
    options: [
      { id: "a", text: "To assign final grades", correct: false, explanation: "Formative assessment is for learning, not grading." },
      { id: "b", text: "To monitor student learning and provide feedback", correct: true, explanation: "Formative assessment guides instruction and student learning." },
      { id: "c", text: "To evaluate teacher effectiveness", correct: false, explanation: "While useful, this is not the primary purpose." },
      { id: "d", text: "To rank students against each other", correct: false, explanation: "Formative assessment is not for ranking or comparison." },
    ],
  },
  {
    id: "t3",
    domain: "Classroom Management",
    question: "What is the most effective classroom management strategy?",
    options: [
      { id: "a", text: "Strict punishment for all misbehavior", correct: false, explanation: "Positive reinforcement is more effective than punishment." },
      { id: "b", text: "Clear expectations and consistent procedures", correct: true, explanation: "Proactive strategies prevent behavior problems." },
      { id: "c", text: "Allowing students to set their own rules", correct: false, explanation: "Students need teacher guidance on expectations." },
      { id: "d", text: "Ignoring minor misbehaviors", correct: false, explanation: "Unaddressed misbehavior often escalates." },
    ],
  },
  {
    id: "t4",
    domain: "Special Education",
    question: "What does IDEA require for students with disabilities?",
    options: [
      { id: "a", text: "Separate classrooms for all students with disabilities", correct: false, explanation: "IDEA emphasizes Least Restrictive Environment." },
      { id: "b", text: "Free Appropriate Public Education (FAPE)", correct: true, explanation: "FAPE is the cornerstone of IDEA." },
      { id: "c", text: "Grade modifications for all assignments", correct: false, explanation: "Accommodations support access, not automatic grade changes." },
      { id: "d", text: "Exemption from standardized testing", correct: false, explanation: "Most students with disabilities participate in assessments." },
    ],
  },
  {
    id: "t5",
    domain: "Professional Ethics",
    question: "When must a teacher report suspected child abuse?",
    options: [
      { id: "a", text: "Only after obtaining proof", correct: false, explanation: "Teachers are mandated reporters who report suspicions, not confirmed cases." },
      { id: "b", text: "Immediately upon suspicion", correct: true, explanation: "Mandated reporters must report suspicions immediately to protect children." },
      { id: "c", text: "After consulting with colleagues", correct: false, explanation: "Reporting is an individual legal responsibility." },
      { id: "d", text: "Only with parental consent", correct: false, explanation: "Parental consent is not required for mandated reporting." },
    ],
  },
];

const servsafeQuestions: CertificationQuestion[] = [
  {
    id: "s1",
    domain: "Food Safety",
    question: "What is the temperature danger zone for food?",
    options: [
      { id: "a", text: "32°F to 40°F", correct: false, explanation: "This is the refrigeration temperature range." },
      { id: "b", text: "41°F to 135°F", correct: true, explanation: "Bacteria multiply rapidly between 41°F and 135°F." },
      { id: "c", text: "140°F to 165°F", correct: false, explanation: "This is above the danger zone." },
      { id: "d", text: "0°F to 32°F", correct: false, explanation: "This is the freezing temperature range." },
    ],
  },
  {
    id: "s2",
    domain: "Cross-Contamination",
    question: "What is the most common cause of cross-contamination?",
    options: [
      { id: "a", text: "Dirty floors", correct: false, explanation: "Floors are less common than direct food contact." },
      { id: "b", text: "Using the same cutting board for raw meat and ready-to-eat food", correct: true, explanation: "Direct contact between raw and ready-to-eat foods is the most common cause." },
      { id: "c", text: "Unwashed vegetables", correct: false, explanation: "This is a source but not the most common cause." },
      { id: "d", text: "Improper handwashing", correct: false, explanation: "Hands spread bacteria but cutting boards are more common for cross-contamination." },
    ],
  },
  {
    id: "s3",
    domain: "Personal Hygiene",
    question: "When must food handlers wash their hands?",
    options: [
      { id: "a", text: "Only after using the restroom", correct: false, explanation: "Handwashing is required in many situations, not just the restroom." },
      { id: "b", text: "After handling ready-to-eat food", correct: false, explanation: "Handwashing is required before handling, not just after." },
      { id: "c", text: "Before starting work and after breaks", correct: false, explanation: "This is required but not the only situations." },
      { id: "d", text: "All of the above situations and more", correct: true, explanation: "Handwashing is required after touching hair/face, using restroom, handling raw food, taking breaks, and more." },
    ],
  },
  {
    id: "s4",
    domain: "Allergens",
    question: "What are the Big 8 food allergens recognized by the FDA?",
    options: [
      { id: "a", text: "Milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, soybeans", correct: true, explanation: "These 8 foods account for 90% of allergic reactions." },
      { id: "b", text: "Dairy, gluten, corn, sugar, yeast, soy, eggs, nuts", correct: false, explanation: "This mix is not the official FDA allergen list." },
      { id: "c", text: "Peanuts, tree nuts, wheat, shellfish, chocolate, berries", correct: false, explanation: "Missing several allergens and including non-allergens." },
      { id: "d", text: "All proteins, dairy, grains, and legumes", correct: false, explanation: "This is overly broad and not the FDA list." },
    ],
  },
  {
    id: "s5",
    domain: "Temperature Control",
    question: "To what temperature must poultry be cooked for safety?",
    options: [
      { id: "a", text: "145°F", correct: false, explanation: "This is for whole cuts of beef, pork, veal, and lamb." },
      { id: "b", text: "155°F", correct: false, explanation: "This is for ground meats." },
      { id: "c", text: "165°F", correct: true, explanation: "Poultry must reach 165°F internally to be safe." },
      { id: "d", text: "175°F", correct: false, explanation: "This exceeds the required minimum." },
    ],
  },
];

const areExamQuestions: CertificationQuestion[] = [
  {
    id: "are1",
    domain: "Practice Management",
    question: "Who is ultimately responsible for the architectural design documents?",
    options: [
      { id: "a", text: "The project manager", correct: false, explanation: "While important, ultimate responsibility lies with the architect." },
      { id: "b", text: "The owner", correct: false, explanation: "Owners hire architects but don't create professional documents." },
      { id: "c", text: "The architect", correct: true, explanation: "The architect of record is ultimately responsible for design documents." },
      { id: "d", text: "The contractor", correct: false, explanation: "Contractors interpret but don't create architectural documents." },
    ],
  },
  {
    id: "are2",
    domain: "Building Systems",
    question: "What is the minimum fresh air requirement per person in office spaces?",
    options: [
      { id: "a", text: "3 CFM", correct: false, explanation: "This is below ASHRAE minimum." },
      { id: "b", text: "5 CFM", correct: true, explanation: "ASHRAE 62.1 requires minimum 5 CFM per person for offices." },
      { id: "c", text: "10 CFM", correct: false, explanation: "This exceeds the minimum requirement." },
      { id: "d", text: "15 CFM", correct: false, explanation: "This is for higher occupancy or specific uses." },
    ],
  },
  {
    id: "are3",
    domain: "Codes",
    question: "What is the maximum egress travel distance in an unsprinklered business occupancy?",
    options: [
      { id: "a", text: "100 feet", correct: false, explanation: "This is too short for business occupancy." },
      { id: "b", text: "150 feet", correct: false, explanation: "This is for sprinklered conditions or other occupancies." },
      { id: "c", text: "200 feet", correct: true, explanation: "IBC allows 200 feet maximum egress travel in unsprinklered business occupancy." },
      { id: "d", text: "300 feet", correct: false, explanation: "This exceeds the maximum allowed." },
    ],
  },
  {
    id: "are4",
    domain: "Accessibility",
    question: "What is the maximum slope for an accessible ramp?",
    options: [
      { id: "a", text: "1:8", correct: false, explanation: "This is steeper than the ADA maximum." },
      { id: "b", text: "1:10", correct: false, explanation: "This is steeper than the ADA maximum." },
      { id: "c", text: "1:12", correct: true, explanation: "ADA requires maximum 1:12 slope for accessible ramps." },
      { id: "d", text: "1:14", correct: false, explanation: "While flatter is accessible, 1:12 is the maximum allowed slope." },
    ],
  },
  {
    id: "are5",
    domain: "Materials",
    question: "What is the required fire-resistance rating for exit stair enclosures?",
    options: [
      { id: "a", text: "30 minutes", correct: false, explanation: "This is below the minimum requirement." },
      { id: "b", text: "1 hour", correct: false, explanation: "This is for some enclosures but not exit stairs." },
      { id: "c", text: "1.5 hours", correct: true, explanation: "Exit stair enclosures typically require 1-2 hour fire rating." },
      { id: "d", text: "2 hours", correct: false, explanation: "While some require 2 hours, 1.5 is the standard minimum." },
    ],
  },
];

const barExamQuestions: CertificationQuestion[] = [
  {
    id: "bar1",
    domain: "Contracts",
    question: "What are the essential elements of a valid contract?",
    options: [
      { id: "a", text: "Offer, acceptance, consideration", correct: true, explanation: "These three elements are required for contract formation." },
      { id: "b", text: "Offer, negotiation, performance", correct: false, explanation: "Negotiation and performance are not required elements." },
      { id: "c", text: "Agreement, capacity, legality", correct: false, explanation: "While important, this is not the traditional three-element formulation." },
      { id: "d", text: "Writing, consideration, intent", correct: false, explanation: "Writing is not required for most contracts." },
    ],
  },
  {
    id: "bar2",
    domain: "Torts",
    question: "What are the elements of negligence?",
    options: [
      { id: "a", text: "Duty, breach, causation, damages", correct: true, explanation: "These four elements must be proven in a negligence claim." },
      { id: "b", text: "Intent, action, result, damages", correct: false, explanation: "Intent relates to intentional torts, not negligence." },
      { id: "c", text: "Duty, intent, causation, harm", correct: false, explanation: "Intent is not required for negligence." },
      { id: "d", text: "Breach, harm, intent, damages", correct: false, explanation: "Missing duty requirement and adds incorrect intent." },
    ],
  },
  {
    id: "bar3",
    domain: "Criminal Law",
    question: "What is required for criminal conviction beyond reasonable doubt?",
    options: [
      { id: "a", text: "Proof of guilt to moral certainty", correct: false, explanation: "This is a jury instruction phrase but not the legal standard." },
      { id: "b", text: "Preponderance of evidence", correct: false, explanation: "This is the civil standard, not criminal." },
      { id: "c", text: "Clear and convincing evidence", correct: false, explanation: "This is an intermediate standard, not beyond reasonable doubt." },
      { id: "d", text: "Evidence that leaves no reasonable doubt of guilt", correct: true, explanation: "Beyond reasonable doubt means evidence that firmly convinces of guilt." },
    ],
  },
  {
    id: "bar4",
    domain: "Constitutional Law",
    question: "What level of scrutiny applies to restrictions on fundamental rights?",
    options: [
      { id: "a", text: "Rational basis", correct: false, explanation: "Rational basis applies to non-fundamental rights." },
      { id: "b", text: "Intermediate scrutiny", correct: false, explanation: "Intermediate scrutiny applies to quasi-suspect classifications." },
      { id: "c", text: "Strict scrutiny", correct: true, explanation: "Strict scrutiny applies to fundamental rights and suspect classifications." },
      { id: "d", text: "Balancing test", correct: false, explanation: "Balancing is used in various contexts but not as the standard for fundamental rights." },
    ],
  },
  {
    id: "bar5",
    domain: "Evidence",
    question: "Which of the following is NOT hearsay?",
    options: [
      { id: "a", text: "A witness testifying about what someone else said", correct: false, explanation: "This is classic hearsay if offered for the truth." },
      { id: "b", text: "A prior statement by the declarant inconsistent with testimony", correct: true, explanation: "Prior inconsistent statements can be non-hearsay if offered for impeachment." },
      { id: "c", text: "Out-of-court statement offered to prove the truth of the matter asserted", correct: false, explanation: "This is the definition of hearsay." },
      { id: "d", text: "Written statement made outside of court", correct: false, explanation: "This describes hearsay unless an exception applies." },
    ],
  },
];

const customerServiceQuestions: CertificationQuestion[] = [
  {
    id: "cs1",
    domain: "Communication",
    question: "What is the most important skill in customer service?",
    options: [
      { id: "a", text: "Sales ability", correct: false, explanation: "Sales is important but not the most critical skill." },
      { id: "b", text: "Active listening", correct: true, explanation: "Listening helps understand customer needs and build rapport." },
      { id: "c", text: "Product knowledge", correct: false, explanation: "Knowledge is important but secondary to understanding needs." },
      { id: "d", text: "Speed of service", correct: false, explanation: "Quality service is more important than pure speed." },
    ],
  },
  {
    id: "cs2",
    domain: "Conflict Resolution",
    question: "How should you handle an angry customer?",
    options: [
      { id: "a", text: "Argue back to defend the company", correct: false, explanation: "Arguing escalates conflict and damages relationships." },
      { id: "b", text: "Remain calm, listen, and acknowledge their concerns", correct: true, explanation: "De-escalation requires patience and acknowledgment." },
      { id: "c", text: "Immediately offer a refund", correct: false, explanation: "Refunds without understanding the issue may not solve the problem." },
      { id: "d", text: "Transfer them to a manager immediately", correct: false, explanation: "This can frustrate customers further; try to resolve at your level first." },
    ],
  },
  {
    id: "cs3",
    domain: "Empathy",
    question: "Why is empathy important in customer service?",
    options: [
      { id: "a", text: "It helps you sell more products", correct: false, explanation: "Empathy builds trust, not necessarily immediate sales." },
      { id: "b", text: "It helps you understand and connect with customer feelings", correct: true, explanation: "Empathy creates rapport and shows customers they're valued." },
      { id: "c", text: "It reduces the time you spend with each customer", correct: false, explanation: "Empathy may take more time initially but prevents escalations." },
      { id: "d", text: "It allows you to ignore company policies", correct: false, explanation: "Empathy doesn't override necessary policies." },
    ],
  },
  {
    id: "cs4",
    domain: "Problem Solving",
    question: "What is the first step in resolving a customer complaint?",
    options: [
      { id: "a", text: "Find someone else to handle it", correct: false, explanation: "Ownership is important in customer service." },
      { id: "b", text: "Listen carefully to understand the issue", correct: true, explanation: "Understanding the problem is essential before solving it." },
      { id: "c", text: "Apologize immediately", correct: false, explanation: "Apology is important but understanding comes first." },
      { id: "d", text: "Document everything before responding", correct: false, explanation: "Documentation is secondary to addressing the customer's concern." },
    ],
  },
  {
    id: "cs5",
    domain: "Follow-up",
    question: "When should you follow up with a customer after resolving their issue?",
    options: [
      { id: "a", text: "Only if they complain again", correct: false, explanation: "Proactive follow-up shows commitment to service." },
      { id: "b", text: "Within 24-48 hours to ensure satisfaction", correct: true, explanation: "Follow-up demonstrates care and ensures resolution was complete." },
      { id: "c", text: "Never, let them move on", correct: false, explanation: "Follow-up can prevent future issues and build loyalty." },
      { id: "d", text: "After they make another purchase", correct: false, explanation: "Follow-up should be about the resolved issue, not future sales." },
    ],
  },
];

const journeymanQuestions: CertificationQuestion[] = [
  {
    id: "j1",
    domain: "Wiring",
    question: "What wire color is used for the equipment grounding conductor?",
    options: [
      { id: "a", text: "Black", correct: false, explanation: "Black is typically used for hot wires." },
      { id: "b", text: "White", correct: false, explanation: "White is typically used for neutral conductors." },
      { id: "c", text: "Green or bare copper", correct: true, explanation: "Equipment grounding conductors must be green, green with yellow stripe, or bare." },
      { id: "d", text: "Red", correct: false, explanation: "Red is typically used for switch legs or second hot." },
    ],
  },
  {
    id: "j2",
    domain: "Safety",
    question: "What must be done before working on any electrical circuit?",
    options: [
      { id: "a", text: "Turn off the light switch", correct: false, explanation: "Turning off the switch doesn't de-energize the circuit." },
      { id: "b", text: "Turn off power at the breaker and verify with a tester", correct: true, explanation: "Lockout/tagout and verification are essential safety practices." },
      { id: "c", text: "Tell someone nearby to be careful", correct: false, explanation: "Verbal warnings don't ensure circuit is safe." },
      { id: "d", text: "Wear rubber gloves and proceed quickly", correct: false, explanation: "PPE doesn't replace proper lockout/tagout procedures." },
    ],
  },
  {
    id: "j3",
    domain: "Codes",
    question: "What is the maximum number of outlets on a 15-amp circuit?",
    options: [
      { id: "a", text: "6 outlets", correct: false, explanation: "This is too few for typical circuit loading." },
      { id: "b", text: "8 outlets (following 80% rule)", correct: true, explanation: "NEC recommends 80% of circuit capacity for continuous loads: 15A × 0.8 = 12A, divided by 1.5A per outlet ≈ 8." },
      { id: "c", text: "12 outlets", correct: false, explanation: "This may overload the circuit under heavy use." },
      { id: "d", text: "Unlimited outlets", correct: false, explanation: "Total load must not exceed circuit capacity." },
    ],
  },
  {
    id: "j4",
    domain: "Grounding",
    question: "What is the purpose of GFCI protection?",
    options: [
      { id: "a", text: "To prevent circuit overload", correct: false, explanation: "Circuit breakers prevent overload, not GFCIs." },
      { id: "b", text: "To prevent electric shock by detecting ground faults", correct: true, explanation: "GFCIs detect current imbalances and trip quickly to prevent shock." },
      { id: "c", text: "To protect against power surges", correct: false, explanation: "Surge protectors handle power surges, not GFCIs." },
      { id: "d", text: "To increase circuit capacity", correct: false, explanation: "GFCIs don't increase capacity; they enhance safety." },
    ],
  },
  {
    id: "j5",
    domain: "Installation",
    question: "At what height above finished floor must receptacles be installed in living areas?",
    options: [
      { id: "a", text: "6 inches", correct: false, explanation: "This is too low and not compliant with NEC." },
      { id: "b", text: "12 inches", correct: false, explanation: "This is below the minimum required height." },
      { id: "c", text: "18 inches", correct: false, explanation: "This is too high and not compliant with NEC." },
      { id: "d", text: "No more than 12 inches above finished floor", correct: true, explanation: "NEC requires receptacles to be installed no more than 12 inches above finished floor in living areas." },
    ],
  },
];

const firefighterCertQuestions: CertificationQuestion[] = [
  {
    id: "fc1",
    domain: "Fire Behavior",
    question: "What is the temperature at which a fire enters the fully developed stage?",
    options: [
      { id: "a", text: "500°F", correct: false, explanation: "This is too low for flashover conditions." },
      { id: "b", text: "1000°F", correct: false, explanation: "This is not the critical threshold." },
      { id: "c", text: "1500°F", correct: false, explanation: "This is high but not the standard measure." },
      { id: "d", text: "Flashover occurs around 1000°F", correct: true, explanation: "Flashover typically occurs around 1000°F when all combustibles ignite simultaneously." },
    ],
  },
  {
    id: "fc2",
    domain: "PPE",
    question: "What does SCBA stand for in firefighting?",
    options: [
      { id: "a", text: "Safety Control Breathing Apparatus", correct: false, explanation: "This is not the correct acronym." },
      { id: "b", text: "Self-Contained Breathing Apparatus", correct: true, explanation: "SCBA provides breathable air in hazardous atmospheres." },
      { id: "c", text: "Standard Combined Breathing Air", correct: false, explanation: "Not the correct expansion." },
      { id: "d", text: "Secure Chemical Breathing Apparatus", correct: false, explanation: "Incorrect." },
    ],
  },
  {
    id: "fc3",
    domain: "Emergency Medical",
    question: "What is the most common call type for fire departments?",
    options: [
      { id: "a", text: "Structure fires", correct: false, explanation: "Fires are less common than medical calls." },
      { id: "b", text: "Vehicle accidents", correct: false, explanation: "While common, not the most frequent." },
      { id: "c", text: "Medical emergencies", correct: true, explanation: "Most fire department calls are for EMS, not fires." },
      { id: "d", text: "Hazardous material incidents", correct: false, explanation: "These are less frequent." },
    ],
  },
  {
    id: "fc4",
    domain: "Ladders",
    question: "What is the proper angle for ground ladders when placed against a wall?",
    options: [
      { id: "a", text: "45 degrees", correct: false, explanation: "This is not the standard placement angle." },
      { id: "b", text: "75 degrees", correct: false, explanation: "This is too steep." },
      { id: "c", text: "Should reach 4 feet above landing", correct: false, explanation: "This is a height requirement, not angle." },
      { id: "d", text: "1:4 ratio (75° from horizontal)", correct: false, explanation: "This is too steep." },
    ],
  },
  {
    id: "fc5",
    domain: "Fire Suppression",
    question: "What is the primary purpose of a fire hose?",
    options: [
      { id: "a", text: "To transport water over long distances", correct: false, explanation: "Primary purpose is not transport." },
      { id: "b", text: "To deliver water or foam to extinguish fires", correct: true, explanation: "Hoses deliver extinguishing agents directly to the fire." },
      { id: "c", text: "To create a barrier between fire and building", correct: false, explanation: "This is not the primary purpose." },
      { id: "d", text: "To cool down the surrounding area", correct: false, explanation: "While it cools, primary purpose is suppression." },
    ],
  },
];

const policeAcademyQuestions: CertificationQuestion[] = [
  {
    id: "pa1",
    domain: "Law",
    question: "What does Miranda warning protect?",
    options: [
      { id: "a", text: "Right to remain silent and right to an attorney", correct: true, explanation: "Miranda protects Fifth Amendment rights during custodial interrogation." },
      { id: "b", text: "Right to bail", correct: false, explanation: "This is not covered in Miranda warnings." },
      { id: "c", text: "Right to a speedy trial", correct: false, explanation: "This is a separate constitutional right." },
      { id: "d", text: "Right to confront witnesses", correct: false, explanation: "This is Sixth Amendment, not Miranda." },
    ],
  },
  {
    id: "pa2",
    domain: "Use of Force",
    question: "When is deadly force justified in law enforcement?",
    options: [
      { id: "a", text: "Any time an officer feels threatened", correct: false, explanation: "Standard is higher than feeling threatened." },
      { id: "b", text: "When fleeing felon is suspected", correct: false, explanation: "Deadly force requires imminent danger." },
      { id: "c", text: "When facing imminent threat of death or serious injury", correct: true, explanation: "Deadly force is only justified when objectively reasonable." },
      { id: "d", text: "During all high-risk traffic stops", correct: false, explanation: "Not all high-risk stops justify deadly force." },
    ],
  },
  {
    id: "pa3",
    domain: "Investigation",
    question: "What should officers do first at a crime scene?",
    options: [
      { id: "a", text: "Interrogate witnesses", correct: false, explanation: "Evidence preservation comes first." },
      { id: "b", text: "Secure the scene and preserve evidence", correct: true, explanation: "First priority is safety and evidence preservation." },
      { id: "c", text: "Take photographs", correct: false, explanation: "Important but comes after securing scene." },
      { id: "d", text: "Start canvassing the neighborhood", correct: false, explanation: "Scene security is priority." },
    ],
  },
  {
    id: "pa4",
    domain: "Ethics",
    question: "What is the most important ethical duty of a police officer?",
    options: [
      { id: "a", text: "Follow orders from supervisors", correct: false, explanation: "Duty to law supersedes orders." },
      { id: "b", text: "Protect constitutional rights and serve community", correct: true, explanation: "Officers serve the public and protect rights." },
      { id: "c", text: "Support fellow officers unconditionally", correct: false, explanation: "Blue wall of silence violates ethics." },
      { id: "d", text: "Maintain personal safety above all", correct: false, explanation: "Public safety is priority in context." },
    ],
  },
  {
    id: "pa5",
    domain: "Patrol",
    question: "What is the primary purpose of routine patrol?",
    options: [
      { id: "a", text: "To write traffic tickets", correct: false, explanation: "Enforcement is one aspect, not primary." },
      { id: "b", text: "To deter crime and maintain visibility", correct: true, explanation: "Visible patrol presence deters criminal activity." },
      { id: "c", text: "To enforce speed limits only", correct: false, explanation: "Much broader scope." },
      { id: "d", text: "To respond to calls for service", correct: false, explanation: "Response is reactive; patrol is proactive." },
    ],
  },
];

const cplLicenseQuestions: CertificationQuestion[] = [
  {
    id: "cpl1",
    domain: "Weather",
    question: "What is the dew point?",
    options: [
      { id: "a", text: "Temperature at which air becomes saturated", correct: true, explanation: "Dew point is when air can't hold more moisture." },
      { id: "b", text: "Difference between temperature and humidity", correct: false, explanation: "This is not the definition." },
      { id: "c", text: "Temperature at which fog forms", correct: false, explanation: "Related but not precise definition." },
      { id: "d", text: "Wind speed measurement", correct: false, explanation: "Unrelated to weather theory." },
    ],
  },
  {
    id: "cpl2",
    domain: "Regulations",
    question: "What does VFR stand for in aviation?",
    options: [
      { id: "a", text: "Visual Flight Rules", correct: true, explanation: "VFR allows flight by visual reference." },
      { id: "b", text: "Velocity Flight Rating", correct: false, explanation: "Not the correct acronym." },
      { id: "c", text: "Vertical Flight Regulations", correct: false, explanation: "Incorrect." },
      { id: "d", text: "Verified Flight Requirements", correct: false, explanation: "Not correct." },
    ],
  },
  {
    id: "cpl3",
    domain: "Navigation",
    question: "What is the primary method of navigation for VFR pilots?",
    options: [
      { id: "a", text: "GPS systems only", correct: false, explanation: "Pilotage and dead reckoning are primary." },
      { id: "b", text: "Visual reference to ground landmarks", correct: true, explanation: "VFR pilots navigate by visual reference." },
      { id: "c", text: "Radio navigation aids only", correct: false, explanation: "Supplemental, not primary." },
      { id: "d", text: "Celestial navigation", correct: false, explanation: "Not used in modern aviation." },
    ],
  },
  {
    id: "cpl4",
    domain: "Aircraft Systems",
    question: "What provides lift to an aircraft in flight?",
    options: [
      { id: "a", text: "Engine thrust", correct: false, explanation: "Thrust provides forward motion, not lift." },
      { id: "b", text: "Wing shape (airfoil) creating pressure differential", correct: true, explanation: "Airfoil design creates lift through Bernoulli's principle." },
      { id: "c", text: "Rudder control", correct: false, explanation: "Rudder controls yaw, not lift." },
      { id: "d", text: "Landing gear", correct: false, explanation: "Landing gear provides ground support." },
    ],
  },
  {
    id: "cpl5",
    domain: "Safety",
    question: "What is the best way to handle wake turbulence?",
    options: [
      { id: "a", text: "Fly faster to escape it", correct: false, explanation: "Speeding up worsens the situation." },
      { id: "b", text: "Maintain positive control and altitude", correct: true, explanation: "Stay alert and maintain control until turbulence passes." },
      { id: "c", text: "Turn away immediately", correct: false, explanation: "Turning may put you in worse conditions." },
      { id: "d", text: "Reduce throttle to idle", correct: false, explanation: "Maintaining airspeed is critical." },
    ],
  },
];

const vetTechQuestions: CertificationQuestion[] = [
  {
    id: "vt1",
    domain: "Animal Care",
    question: "What is the normal body temperature for a dog?",
    options: [
      { id: "a", text: "98-100°F", correct: false, explanation: "This is too low for canine temperature." },
      { id: "b", text: "100-102°F", correct: false, explanation: "This is still below normal range." },
      { id: "c", text: "101-102.5°F", correct: true, explanation: "Normal canine temperature is 101-102.5°F." },
      { id: "d", text: "103-104°F", correct: false, explanation: "This indicates fever in dogs." },
    ],
  },
  {
    id: "vt2",
    domain: "Anatomy",
    question: "How many lobes make up a dog's lung?",
    options: [
      { id: "a", text: "Two", correct: false, explanation: "Dogs have more than two lobes." },
      { id: "b", text: "Three", correct: false, explanation: "Dogs typically have four or more." },
      { id: "c", text: "Four", correct: true, explanation: "Dogs have four lung lobes (cranial and caudal on each side)." },
      { id: "d", text: "Five", correct: false, explanation: "Not the correct number." },
    ],
  },
  {
    id: "vt3",
    domain: "Pharmacology",
    question: "Which medication is commonly used for heartworm prevention?",
    options: [
      { id: "a", text: "Antibiotics", correct: false, explanation: "Not used for heartworm prevention." },
      { id: "b", text: "Macrocyclic lactones (e.g., Heartgard)", correct: true, explanation: "Monthly preventive medications target heartworms." },
      { id: "c", text: "Pain relievers", correct: false, explanation: "Not for parasite prevention." },
      { id: "d", text: "Vitamins", correct: false, explanation: "Supplemental, not preventive." },
    ],
  },
  {
    id: "vt4",
    domain: "Surgery",
    question: "What position is used for abdominal surgery in animals?",
    options: [
      { id: "a", text: "Lateral recumbency", correct: false, explanation: "Side-lying position for other procedures." },
      { id: "b", text: "Dorsal recumbency", correct: true, explanation: "On the back with legs extended is standard for abdominal access." },
      { id: "c", text: "Trendelenburg", correct: false, explanation: "Not standard for surgery." },
      { id: "d", text: "Jackknife", correct: false, explanation: "Specific positioning for other uses." },
    ],
  },
  {
    id: "vt5",
    domain: "Dentistry",
    question: "What is the best way to assess oral health in pets?",
    options: [
      { id: "a", text: "Visual inspection while awake only", correct: false, explanation: "Needs more thorough examination." },
      { id: "b", text: "Physical exam under sedation", correct: true, explanation: "Safe, thorough assessment requires calm patient." },
      { id: "c", text: "Blood tests", correct: false, explanation: "Indirect indicator." },
      { id: "d", text: "X-ray from distance", correct: false, explanation: "Dental radiographs require close positioning." },
    ],
  },
];

const journalismAwardQuestions: CertificationQuestion[] = [
  {
    id: "ja1",
    domain: "Ethics",
    question: "What is the primary principle of journalistic ethics?",
    options: [
      { id: "a", text: "Get the story first regardless of facts", correct: false, explanation: "Speed must not compromise accuracy." },
      { id: "b", text: "Seek truth and report it accurately", correct: true, explanation: "Accuracy and truth are fundamental." },
      { id: "c", text: "Entertain the audience above all", correct: false, explanation: "Entertainment is secondary to informing." },
      { id: "d", text: "Support political candidates", correct: false, explanation: "Journalism should be impartial." },
    ],
  },
  {
    id: "ja2",
    domain: "Legal",
    question: "What is defamation in journalism?",
    options: [
      { id: "a", text: "Reporting on public figures", correct: false, explanation: "Not defamation." },
      { id: "b", text: "False statement damaging to reputation", correct: true, explanation: "Defamation requires false factual statements that harm reputation." },
      { id: "c", text: "Criticizing public policy", correct: false, explanation: "Protected opinion." },
      { id: "d", text: "Interviewing sources", correct: false, explanation: "Standard practice." },
    ],
  },
  {
    id: "ja3",
    domain: "Sources",
    question: "What is the responsibility regarding anonymous sources?",
    options: [
      { id: "a", text: "Never use anonymous sources", correct: false, explanation: "Sometimes necessary but must be verified." },
      { id: "b", text: "Use only when information cannot be obtained otherwise", correct: true, explanation: "Anonymous sources require strong justification." },
      { id: "c", text: "Always reveal anonymous sources to subjects", correct: false, explanation: "Would defeat purpose of anonymity." },
      { id: "d", text: "Publish all anonymous tips immediately", correct: false, explanation: "Must verify before publishing." },
    ],
  },
  {
    id: "ja4",
    domain: "Writing",
    question: "What is the inverted pyramid style?",
    options: [
      { id: "a", text: "Story told like a pyramid shape", correct: false, explanation: "Not about visual layout." },
      { id: "b", text: "Most important information first", correct: true, explanation: "Key facts come first, details follow." },
      { id: "c", text: "All questions answered at the end", correct: false, explanation: "Not the structure for news." },
      { id: "d", text: "Personal opinion at the top", correct: false, explanation: "Should be factual." },
    ],
  },
  {
    id: "ja5",
    domain: "Verification",
    question: "What is verification in journalism?",
    options: [
      { id: "a", text: "Making up quotes that sound real", correct: false, explanation: "Unethical and potentially illegal." },
      { id: "b", text: "Confirming information through multiple independent sources", correct: true, explanation: "Verification ensures accuracy before publication." },
      { id: "c", text: "Trusting first source only", correct: false, explanation: "Requires confirmation." },
      { id: "d", text: "Waiting for someone else to report it first", correct: false, explanation: "This is following, not verifying." },
    ],
  },
];

const lcswQuestions: CertificationQuestion[] = [
  {
    id: "lcsw1",
    domain: "Theory",
    question: "What does CBT stand for in clinical social work?",
    options: [
      { id: "a", text: "Cognitive Behavioral Therapy", correct: true, explanation: "CBT focuses on thoughts and behaviors." },
      { id: "b", text: "Community-Based Therapy", correct: false, explanation: "Not the standard abbreviation." },
      { id: "c", text: "Clinical Brief Therapy", correct: false, explanation: "Incorrect." },
      { id: "d", text: "Cost-Benefit Treatment", correct: false, explanation: "Not relevant." },
    ],
  },
  {
    id: "lcsw2",
    domain: "HIPAA",
    question: "What is required for HIPAA compliance?",
    options: [
      { id: "a", text: "Share all client information casually", correct: false, explanation: "Confidentiality is essential." },
      { id: "b", text: "Protect client health information and limit disclosure", correct: true, explanation: "HIPAA requires safeguarding health information." },
      { id: "c", text: "Only discuss clients in private spaces", correct: false, explanation: "Incomplete - covers more." },
      { id: "d", text: "Forget after case closes", correct: false, explanation: "Records must be maintained." },
    ],
  },
  {
    id: "lcsw3",
    domain: "Assessment",
    question: "What is the biopsychosocial model?",
    options: [
      { id: "a", text: "Only biological factors matter in treatment", correct: false, explanation: "Too narrow - needs more factors." },
      { id: "b", text: "Biological, psychological, and social factors interact", correct: true, explanation: "Holistic approach to client assessment." },
      { id: "c", text: "Group therapy only approach", correct: false, explanation: "Not about group work." },
      { id: "d", text: "Family systems only", correct: false, explanation: "Too narrow." },
    ],
  },
  {
    id: "lcsw4",
    domain: "Intervention",
    question: "What is the primary goal of crisis intervention?",
    options: [
      { id: "a", text: "Immediate symptom reduction and safety", correct: true, explanation: "Focus on stabilizing immediate crisis." },
      { id: "b", text: "Long-term therapy planning", correct: false, explanation: "This comes after stabilization." },
      { id: "c", text: "Medication prescription", correct: false, explanation: "Social workers don't prescribe medication." },
      { id: "d", text: "Case transfer to another agency", correct: false, explanation: "Intervention comes before transfer decisions." },
    ],
  },
  {
    id: "lcsw5",
    domain: "Ethics",
    question: "When must a social worker report suspected abuse?",
    options: [
      { id: "a", text: "Only if certain proof exists", correct: false, explanation: "Must report suspicions, not confirmations." },
      { id: "b", text: "If there is reasonable suspicion", correct: true, explanation: "Mandated reporters must report suspicions immediately." },
      { id: "c", text: "Only with parental permission", correct: false, explanation: "Reporting is mandatory regardless of permission." },
      { id: "d", text: "After consulting with supervisor", correct: false, explanation: "Delay can harm children." },
    ],
  },
];

const cpaQuestions: CertificationQuestion[] = [
  {
    id: "cpa1",
    domain: "Ethics",
    question: "What is the auditor's responsibility regarding fraud?",
    options: [
      { id: "a", text: "Detect all fraud in financial statements", correct: false, explanation: "Auditors plan for reasonable detection, not all fraud." },
      { id: "b", text: "Plan audit to detect material fraud", correct: true, explanation: "Auditors must design procedures to detect material misstatement." },
      { id: "c", text: "Ignore fraud unless obvious", correct: false, explanation: "This violates professional standards." },
      { id: "d", text: "Report fraud to law enforcement directly", correct: false, explanation: "Report to audit committee first." },
    ],
  },
  {
    id: "cpa2",
    domain: "Auditing",
    question: "What does GAAP stand for?",
    options: [
      { id: "a", text: "Generally Accepted Accounting Principles", correct: true, explanation: "GAAP is the standard for financial reporting." },
      { id: "b", text: "Government Accounting Audit Process", correct: false, explanation: "Not the correct expansion." },
      { id: "c", text: "Global Accounting Accuracy Protocol", correct: false, explanation: "Incorrect." },
      { id: "d", text: "Grouped Asset Analysis Process", correct: false, explanation: "Not correct." },
    ],
  },
  {
    id: "cpa3",
    domain: "Tax",
    question: "What is the standard mileage rate for business use in 2024?",
    options: [
      { id: "a", text: "58.5 cents per mile", correct: false, explanation: "This is not the 2024 rate." },
      { id: "b", text: "65.5 cents per mile", correct: false, explanation: "Check current IRS guidelines." },
      { id: "c", text: "67 cents per mile", correct: true, explanation: "IRS standard mileage rate for 2024 business miles." },
      { id: "d", text: "70 cents per mile", correct: false, explanation: "Too high for standard rate." },
    ],
  },
  {
    id: "cpa4",
    domain: "Financial",
    question: "What is working capital?",
    options: [
      { id: "a", text: "Total assets minus total liabilities", correct: false, explanation: "This is equity, not working capital." },
      { id: "b", text: "Current assets minus current liabilities", correct: true, explanation: "Working capital measures short-term liquidity." },
      { id: "c", text: "Cash on hand only", correct: false, explanation: "More comprehensive measure." },
      { id: "d", text: "Yearly revenue", correct: false, explanation: "Not a balance sheet measure." },
    ],
  },
  {
    id: "cpa5",
    domain: "Reporting",
    question: "What is the purpose of a trial balance?",
    options: [
      { id: "a", text: "Ensure total debits equal credits before financial statements", correct: true, explanation: "Trial balance confirms mathematical accuracy of ledger." },
      { id: "b", text: "Record all transactions", correct: false, explanation: "Done before trial balance." },
      { id: "c", text: "Calculate tax obligations", correct: false, explanation: "Separate process." },
      { id: "d", text: "Determine profit margin", correct: false, explanation: "Calculated during reporting." },
    ],
  },
];

const dentalBoardQuestions: CertificationQuestion[] = [
  {
    id: "db1",
    domain: "Anatomy",
    question: "How many teeth does an adult human typically have?",
    options: [
      { id: "a", text: "28", correct: false, explanation: "Missing the third molars." },
      { id: "b", text: "30", correct: false, explanation: "Correct number is 32." },
      { id: "c", text: "32", correct: true, explanation: "32 teeth including 4 wisdom teeth per quadrant." },
      { id: "d", text: "36", correct: false, explanation: "Too high for typical adult dentition." },
    ],
  },
  {
    id: "db2",
    domain: "Procedures",
    question: "What is the purpose of local anesthesia in dentistry?",
    options: [
      { id: "a", text: "Render patient unconscious", correct: false, explanation: "That's general anesthesia." },
      { id: "b", text: "Block pain sensation in specific area", correct: true, explanation: "Local anesthesia numbs the injection site." },
      { id: "c", text: "Reduce anxiety only", correct: false, explanation: "That's nitrous oxide or sedation." },
      { id: "d", text: "Speed up the procedure", correct: false, explanation: "Not the purpose." },
    ],
  },
  {
    id: "db3",
    domain: "Materials",
    question: "What is composite resin commonly used for?",
    options: [
      { id: "a", text: "Root canals", correct: false, explanation: "Gutta percha is used for root canals." },
      { id: "b", text: "Fillings and bonding", correct: true, explanation: "Composite resin is for tooth-colored restorations." },
      { id: "c", text: "Crowns only", correct: false, explanation: "Different material." },
      { id: "d", text: "Implants only", correct: false, explanation: "Different material." },
    ],
  },
  {
    id: "db4",
    domain: "Safety",
    question: "What infection control measure is essential in dentistry?",
    options: [
      { id: "a", text: "Rub hands quickly", correct: false, explanation: "Specific protocol required." },
      { id: "b", text: "Wear gloves only when visibly dirty", correct: false, explanation: "Universal precautions always." },
      { id: "c", text: "Universal precautions for all patients", correct: true, explanation: "Treat all as potentially infectious." },
      { id: "d", text: "Clean instruments weekly", correct: false, explanation: "Sterilization is after each use." },
    ],
  },
  {
    id: "db5",
    domain: "Radiology",
    question: "What is the ALARA principle in dental X-rays?",
    options: [
      { id: "a", text: "Take as many X-rays as possible", correct: false, explanation: "Opposite of ALARA." },
      { id: "b", text: "As Low As Reasonably Achievable radiation exposure", correct: true, explanation: "ALARA minimizes patient radiation." },
      { id: "c", text: "Always use the largest film", correct: false, explanation: "Size depends on area being imaged." },
      { id: "d", text: "Avoid all X-rays for children", correct: false, explanation: "Needed when indicated with precautions." },
    ],
  },
];

const osha30Questions: CertificationQuestion[] = [
  {
    id: "osha1",
    domain: "Hazards",
    question: "What are the three main categories of construction hazards?",
    options: [
      { id: "a", text: "Falls, electrocution, struck-by, caught-in/between", correct: false, explanation: "Missing one category." },
      { id: "b", text: "Falls, struck-by, caught-in/between, hazardous substances", correct: false, explanation: "Out of order and incomplete." },
      { id: "c", text: "Falls, electrocution, struck-by, caught-in/between", correct: true, explanation: "These are the four fatal OSHA categories." },
      { id: "d", text: "Weather, schedule, budget, quality", correct: false, explanation: "These are project management issues." },
    ],
  },
  {
    id: "osha2",
    domain: "Protection",
    question: "What does PPE stand for?",
    options: [
      { id: "a", text: "Personal Protective Equipment", correct: true, explanation: "PPE includes hard hats, safety glasses, etc." },
      { id: "b", text: "Professional Project Evaluation", correct: false, explanation: "Not related to safety." },
      { id: "c", text: "Proper Performance Essentials", correct: false, explanation: "Not correct." },
      { id: "d", text: "Preventive Property Engineering", correct: false, explanation: "Incorrect." },
    ],
  },
  {
    id: "osha3",
    domain: "Fall Protection",
    question: "At what height is fall protection required on construction sites?",
    options: [
      { id: "a", text: "6 feet", correct: false, explanation: "Standard is higher." },
      { id: "b", text: "8 feet", correct: false, explanation: "Not the OSHA requirement." },
      { id: "c", text: "10 feet", correct: false, explanation: "Not the construction standard." },
      { id: "d", text: "6 feet for general industry, 10+ feet for construction", correct: true, explanation: "OSHA requires fall protection at 6 feet in general industry, higher thresholds in construction." },
    ],
  },
  {
    id: "osha4",
    domain: "Scaffolding",
    question: "What is the maximum load for most scaffold platforms?",
    options: [
      { id: "a", text: "20 pounds per square foot", correct: false, explanation: "Too low for typical loads." },
      { id: "b", text: "35 pounds per square foot", correct: false, explanation: "Below standard." },
      { id: "c", text: "50 pounds per square foot", correct: true, explanation: "Plus 4 times the intended load for impact." },
      { id: "d", text: "100 pounds per square foot", correct: false, explanation: "Too high for typical scaffolding." },
    ],
  },
  {
    id: "osha5",
    domain: "Excavation",
    question: "What is the minimum depth requiring a trench box or sloping?",
    options: [
      { id: "a", text: "2 feet", correct: false, explanation: "Below requirement." },
      { id: "b", text: "3 feet", correct: false, explanation: "Still below standard." },
      { id: "c", text: "5 feet", correct: true, explanation: "OSHA requires protective systems at 5 feet depth." },
      { id: "d", text: "10 feet", correct: false, explanation: "Too deep without protection." },
    ],
  },
];

export const certificationQuestionBank = {
  "aws-developer": awsDeveloperQuestions,
  "rn-license": rnLicenseQuestions,
  "pe-license": peLicenseQuestions,
  "teaching-license": teachingLicenseQuestions,
  "servsafe": servsafeQuestions,
  "are-exam": areExamQuestions,
  "bar-exam": barExamQuestions,
  "customer-service": customerServiceQuestions,
  "journeyman": journeymanQuestions,
  "firefighter-cert": firefighterCertQuestions,
  "police-academy": policeAcademyQuestions,
  "cpl-license": cplLicenseQuestions,
  "vet-tech": vetTechQuestions,
  "journalism-award": journalismAwardQuestions,
  "lcsw": lcswQuestions,
  "cpa": cpaQuestions,
  "dental-board": dentalBoardQuestions,
  "osha-30": osha30Questions,
} as const;

export const certificationConfig = {
  "aws-developer": { questionCount: 5, passPercentage: 80, timeLimitSeconds: null },
  "rn-license": { questionCount: 5, passPercentage: 80, timeLimitSeconds: null },
  "pe-license": { questionCount: 5, passPercentage: 80, timeLimitSeconds: null },
  "teaching-license": { questionCount: 5, passPercentage: 80, timeLimitSeconds: null },
  "servsafe": { questionCount: 5, passPercentage: 80, timeLimitSeconds: null },
  "are-exam": { questionCount: 5, passPercentage: 80, timeLimitSeconds: null },
  "bar-exam": { questionCount: 5, passPercentage: 80, timeLimitSeconds: null },
  "customer-service": { questionCount: 5, passPercentage: 80, timeLimitSeconds: null },
  "journeyman": { questionCount: 5, passPercentage: 80, timeLimitSeconds: null },
  "firefighter-cert": { questionCount: 5, passPercentage: 80, timeLimitSeconds: null },
  "police-academy": { questionCount: 5, passPercentage: 80, timeLimitSeconds: null },
  "cpl-license": { questionCount: 5, passPercentage: 80, timeLimitSeconds: null },
  "vet-tech": { questionCount: 5, passPercentage: 80, timeLimitSeconds: null },
  "journalism-award": { questionCount: 5, passPercentage: 80, timeLimitSeconds: null },
  "lcsw": { questionCount: 5, passPercentage: 80, timeLimitSeconds: null },
  "cpa": { questionCount: 5, passPercentage: 80, timeLimitSeconds: null },
  "dental-board": { questionCount: 5, passPercentage: 80, timeLimitSeconds: null },
  "osha-30": { questionCount: 5, passPercentage: 80, timeLimitSeconds: null },
} as const;

export const certificationMetadata: Record<string, { title: string; icon: string; description: string; color: string }> = {
  "aws-developer": {
    title: "AWS Certified Developer Associate",
    icon: "☁️",
    description: "Amazon Web Services cloud development",
    color: "orange",
  },
  "rn-license": {
    title: "Registered Nurse (RN) License",
    icon: "🏥",
    description: "National nursing licensure exam",
    color: "blue",
  },
  "pe-license": {
    title: "Professional Engineer (PE) License",
    icon: "🏗️",
    description: "Engineering licensure and design authority",
    color: "indigo",
  },
  "teaching-license": {
    title: "State Teaching License",
    icon: "🍎",
    description: "K-12 educator certification",
    color: "purple",
  },
  "servsafe": {
    title: "ServSafe Food Handler Certification",
    icon: "👨‍🍳",
    description: "Food safety and sanitation",
    color: "green",
  },
  "are-exam": {
    title: "Architect Registration Examination (ARE)",
    icon: "🏛️",
    description: "Architecture licensure exam",
    color: "blue",
  },
  "bar-exam": {
    title: "State Bar Examination",
    icon: "⚖️",
    description: "Legal practice licensure",
    color: "purple",
  },
  "customer-service": {
    title: "Customer Service Excellence Certification",
    icon: "🛍️",
    description: "Professional service standards",
    color: "teal",
  },
  "journeyman": {
    title: "Journeyman Electrician License",
    icon: "⚡",
    description: "Electrical work licensure",
    color: "yellow",
  },
  "firefighter-cert": {
    title: "Firefighter I & II Certification",
    icon: "🚒",
    description: "Fire service professional certification",
    color: "red",
  },
  "police-academy": {
    title: "Police Academy Certification",
    icon: "👮",
    description: "Law enforcement training completion",
    color: "blue",
  },
  "cpl-license": {
    title: "Commercial Pilot License",
    icon: "✈️",
    description: "Aviation pilot certification",
    color: "sky",
  },
  "vet-tech": {
    title: "Veterinary Technician Certification",
    icon: "🐕",
    description: "Animal healthcare certification",
    color: "green",
  },
  "journalism-award": {
    title: "Journalism Excellence Award",
    icon: "📰",
    description: "Reporting and ethics certification",
    color: "slate",
  },
  "lcsw": {
    title: "Licensed Clinical Social Worker",
    icon: "🤝",
    description: "Clinical social work certification",
    color: "teal",
  },
  "cpa": {
    title: "Certified Public Accountant",
    icon: "📊",
    description: "Accounting and tax professional certification",
    color: "emerald",
  },
  "dental-board": {
    title: "Dental Board Certification",
    icon: "🦷",
    description: "Dental practice certification",
    color: "blue",
  },
  "osha-30": {
    title: "OSHA 30-Hour Construction",
    icon: "🏗️",
    description: "Construction safety certification",
    color: "orange",
  },
} as const;

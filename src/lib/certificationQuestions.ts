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
} as const;

export const certificationConfig = {
  "aws-developer": { questionCount: 5, passPercentage: 70, timeLimitSeconds: null },
  "rn-license": { questionCount: 5, passPercentage: 70, timeLimitSeconds: null },
  "pe-license": { questionCount: 5, passPercentage: 70, timeLimitSeconds: null },
  "teaching-license": { questionCount: 5, passPercentage: 70, timeLimitSeconds: null },
  "servsafe": { questionCount: 5, passPercentage: 70, timeLimitSeconds: null },
  "are-exam": { questionCount: 5, passPercentage: 70, timeLimitSeconds: null },
  "bar-exam": { questionCount: 5, passPercentage: 70, timeLimitSeconds: null },
  "customer-service": { questionCount: 5, passPercentage: 70, timeLimitSeconds: null },
  "journeyman": { questionCount: 5, passPercentage: 70, timeLimitSeconds: null },
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
} as const;

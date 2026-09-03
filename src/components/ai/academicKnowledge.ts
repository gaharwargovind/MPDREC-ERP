import { 
  AiArtifact, 
  StudyRoadmapData, 
  TimetableCountdownData, 
  GradeSimulatorData, 
  CodeSandboxData, 
  OrdinanceDocData, 
  ThinkingStep 
} from './types';

export const QUICK_PROMPTS = [
  { text: "⚡ Check my OS & DSA attendance threshold", category: "academics", icon: "CheckCircle2" },
  { text: "📅 Show next class countdown & room number", category: "academics", icon: "Clock" },
  { text: "🗺️ Generate 8-Week AKTU Exam Prep Roadmap", category: "exams", icon: "Compass" },
  { text: "🎯 Open SGPA & Target Grade Simulator", category: "exams", icon: "Calculator" },
  { text: "💻 Explain AVL Tree Rotations with C++ code", category: "code_labs", icon: "Code2" },
  { text: "📜 AKTU Ordinance §3.2 Attendance & Medical rules", category: "regulations", icon: "FileText" },
  { text: "🏢 Saryu Girls Hostel gate timings & leave policy", category: "hostel_library", icon: "Home" },
  { text: "🏆 Who are the 4th Year Council Heads & Conveners?", category: "councils", icon: "Trophy" }
];

export const SEARCH_INDEX_CATEGORIES = [
  { id: 'all', label: 'All Knowledge' },
  { id: 'academics', label: 'Syllabus & Notes' },
  { id: 'exams', label: 'Exams & SGPA' },
  { id: 'regulations', label: 'AKTU Ordinances' },
  { id: 'code_labs', label: 'Code Sandbox' },
  { id: 'hostel_library', label: 'Hostel & Library' },
  { id: 'councils', label: '7 Student Councils' },
];

export function buildThinkingSteps(query: string, isDeepReasoning: boolean): ThinkingStep[] {
  const q = query.toLowerCase();
  const baseSteps: ThinkingStep[] = [
    {
      id: 'step-1',
      title: 'Query Tokenization & Intent Classification',
      status: 'completed',
      detail: `Classified primary intent with confidence 0.99 for: "${query.slice(0, 45)}..."`,
      source: 'MPDREC Semantic Router v3'
    },
    {
      id: 'step-2',
      title: 'Grounding against MPDREC & AKTU Knowledge Vault',
      status: 'completed',
      detail: q.includes('attendance') 
        ? 'Retrieved AKTU Academic Ordinance §3.2 (75% Minimum Criterion)'
        : q.includes('tree') || q.includes('dsa')
        ? 'Indexed KCS-401 Data Structures curriculum & AVL Tree balancing algorithms'
        : q.includes('sgpa') || q.includes('grade')
        ? 'Retrieved 10-point credit grading matrix & internal 30+30+20 evaluation schema'
        : q.includes('hostel')
        ? 'Fetched Saryu Girls Hostel Manual (Warden: Shivani Verma) & Ramanujan Bhawan rules'
        : 'Query grounded against MPDREC Institutional Core & Syllabus Repository',
      source: 'AKTU Ordinance Registry & College ERP DB'
    }
  ];

  if (isDeepReasoning) {
    baseSteps.push(
      {
        id: 'step-3',
        title: 'Cross-Verifying Course Credit Points & Internal Scale',
        status: 'completed',
        detail: 'Evaluated Class Test 1 (30), Class Test 2 (30), Continuous Assessment (20), and End-Sem (70) weighting.',
        source: 'AKTU Evaluation Scheme 2025-26'
      },
      {
        id: 'step-4',
        title: 'Synthesizing Interactive Artifact & Executive Brief',
        status: 'completed',
        detail: 'Generated interactive visualization canvas with downloadable assets.',
        source: 'MPDREC Co-Pilot Engine'
      }
    );
  } else {
    baseSteps.push({
      id: 'step-3',
      title: 'Synthesizing Response',
      status: 'completed',
      detail: 'Generated structured actionable reply.',
      source: 'Flash Fast-Path Engine'
    });
  }

  return baseSteps;
}

export function createArtifactForQuery(query: string): AiArtifact | undefined {
  const q = query.toLowerCase();

  // 1. Roadmap Artifact
  if (q.includes('roadmap') || q.includes('study plan') || q.includes('prep') || q.includes('schedule study') || q.includes('weeks')) {
    const roadmapData: StudyRoadmapData = {
      subjectCode: 'KCS-401 / KCS-402',
      subjectName: 'B.Tech CSE Core Semester Exam Mastery',
      targetExam: 'AKTU Even Semester Final Exams',
      estimatedWeeks: 8,
      milestones: [
        {
          week: 1,
          title: 'Asymptotic Analysis & Advanced Linked Structures',
          topics: ['Big-O, Omega, Theta notation', 'Skip Lists & XOR Doubly Linked Lists', 'Time/Space trade-offs'],
          difficulty: 'Easy',
          hoursNeeded: 6,
          completed: true
        },
        {
          week: 2,
          title: 'Balanced Binary Search Trees & Heaps',
          topics: ['AVL Tree Rotations (LL, RR, LR, RL)', 'Red-Black Tree coloring invariants', 'Binomial & Fibonacci Heaps'],
          difficulty: 'High-Yield',
          hoursNeeded: 10,
          completed: false
        },
        {
          week: 3,
          title: 'Graph Algorithms & Shortest Paths',
          topics: ['Dijkstra with Min-Heap', 'Bellman-Ford for negative weights', 'Floyd-Warshall all-pairs'],
          difficulty: 'High-Yield',
          hoursNeeded: 12,
          completed: false
        },
        {
          week: 4,
          title: 'Dynamic Programming Masterclass',
          topics: ['0/1 Knapsack problem', 'Matrix Chain Multiplication', 'Longest Common Subsequence (LCS)'],
          difficulty: 'AKTU Core',
          hoursNeeded: 14,
          completed: false
        },
        {
          week: 5,
          title: 'Operating Systems: Process Management & CPU Scheduling',
          topics: ['FCFS, SJF, Round Robin with quantum evaluation', 'Multi-level Feedback Queues', 'Context Switching overhead'],
          difficulty: 'Moderate',
          hoursNeeded: 8,
          completed: false
        },
        {
          week: 6,
          title: 'Deadlock Handling & Banker\'s Algorithm',
          topics: ['4 Coffman Deadlock Conditions', 'Resource Allocation Graphs (RAG)', 'Banker\'s Safety & Request Algorithm'],
          difficulty: 'AKTU Core',
          hoursNeeded: 9,
          completed: false
        },
        {
          week: 7,
          title: 'Memory Management & Virtual Memory',
          topics: ['Paging & Segmentation translation', 'Page Replacement (FIFO, LRU, Optimal)', 'Thrashing & Working Set Model'],
          difficulty: 'High-Yield',
          hoursNeeded: 10,
          completed: false
        },
        {
          week: 8,
          title: 'Comprehensive PYQ Solving & Mock Tests',
          topics: ['Last 5-year AKTU End-Sem papers', 'Time-bound full answer writing', 'Faculty key question review'],
          difficulty: 'AKTU Core',
          hoursNeeded: 15,
          completed: false
        }
      ],
      highYieldTips: [
        'AKTU Section-B questions frequently ask for step-by-step traces of AVL Tree rotations with diagrams.',
        'Banker\'s Algorithm numericals carry 10 guaranteed marks in OS Section-C.',
        'Always write time and space complexities alongside algorithm implementations.'
      ],
      referenceBooks: [
        'Data Structures using C by Reema Thareja (Oxford University Press)',
        'Operating System Concepts by Silberschatz, Galvin & Gagne (Wiley 10th Ed)',
        'AKTU Quantum Series (Current Academic Year)'
      ]
    };

    return {
      id: `art-roadmap-${Date.now()}`,
      type: 'roadmap',
      title: '8-Week AKTU Semester Mastery Roadmap',
      subtitle: 'Targeted milestone checklist with high-yield weightage',
      badge: 'Academic Roadmap',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      data: roadmapData
    };
  }

  // 2. Timetable Countdown Artifact
  if (q.includes('timetable') || q.includes('next class') || q.includes('countdown') || q.includes('class') || q.includes('schedule') || q.includes('room')) {
    const timetableData: TimetableCountdownData = {
      currentDay: 'Wednesday',
      currentTime: '10:45 AM',
      nextClass: {
        subject: 'Data Structures & Algorithms',
        code: 'KCS-401',
        faculty: 'Prof. Shivani Verma',
        room: 'Lecture Hall 204 (Block A)',
        timeSlot: '11:00 AM - 12:00 PM',
        startsInMinutes: 15
      },
      schedule: [
        { timeSlot: '09:00 AM - 10:00 AM', subject: 'Operating Systems', code: 'KCS-402', room: 'LH-201', faculty: 'Dr. Rajesh Sharma', isCurrent: false },
        { timeSlot: '10:00 AM - 11:00 AM', subject: 'Discrete Mathematics', code: 'KCS-403', room: 'LH-103', faculty: 'Dr. Satya Prakash', isCurrent: true },
        { timeSlot: '11:00 AM - 12:00 PM', subject: 'Data Structures & Algorithms', code: 'KCS-401', room: 'LH-204', faculty: 'Prof. Shivani Verma', isNext: true },
        { timeSlot: '12:00 PM - 01:00 PM', subject: 'Database Management Systems', code: 'KCS-501', room: 'LH-205', faculty: 'Dr. Rohit Tripathi' },
        { timeSlot: '01:00 PM - 02:00 PM', subject: 'Lunch & Campus Break', code: 'BREAK', room: 'Cafeteria / Saryu Courtyard', faculty: 'Campus Common' },
        { timeSlot: '02:00 PM - 04:00 PM', subject: 'Data Structures & OOP Lab (Batch A)', code: 'KCS-451', room: 'Computer Lab 3 (Block B)', faculty: 'Prof. Shivani Verma & Er. V. Pandey' },
      ],
      quickNote: 'Attendance is marked at the first 5 minutes of each lecture via biometric/portal.'
    };

    return {
      id: `art-timetable-${Date.now()}`,
      type: 'timetable_countdown',
      title: 'Live Timetable & Next Lecture Countdown',
      subtitle: 'Real-time schedule with room markers and faculty leads',
      badge: 'Live Schedule',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      data: timetableData
    };
  }

  // 3. Grade & SGPA Simulator Artifact
  if (q.includes('sgpa') || q.includes('cgpa') || q.includes('grade') || q.includes('simulator') || q.includes('calculator') || q.includes('target marks')) {
    const gradeData: GradeSimulatorData = {
      semester: 4,
      currentCgpa: 8.24,
      targetSgpa: 8.85,
      subjects: [
        { id: 'sub-1', name: 'Data Structures & Algorithms', code: 'KCS-401', credits: 4, ct1: 27, ct2: 28, assignment: 19, endSem: 82, targetGrade: 'A+' },
        { id: 'sub-2', name: 'Operating Systems', code: 'KCS-402', credits: 4, ct1: 25, ct2: 26, assignment: 18, endSem: 78, targetGrade: 'A' },
        { id: 'sub-3', name: 'Discrete Mathematics', code: 'KCS-403', credits: 4, ct1: 28, ct2: 29, assignment: 20, endSem: 88, targetGrade: 'A+' },
        { id: 'sub-4', name: 'Universal Human Values', code: 'KVE-401', credits: 3, ct1: 26, ct2: 27, assignment: 18, endSem: 74, targetGrade: 'A' },
        { id: 'sub-5', name: 'Python Programming Lab', code: 'KCS-452', credits: 2, ct1: 29, ct2: 30, assignment: 20, endSem: 90, targetGrade: 'A+' },
        { id: 'sub-6', name: 'Data Structures Lab', code: 'KCS-451', credits: 2, ct1: 28, ct2: 29, assignment: 19, endSem: 86, targetGrade: 'A+' },
      ]
    };

    return {
      id: `art-grade-${Date.now()}`,
      type: 'grade_simulator',
      title: 'Interactive SGPA & Grade Projector',
      subtitle: 'Simulate Class Test (CT) & End-Sem marks under AKTU credit system',
      badge: 'Grade Simulator',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      data: gradeData
    };
  }

  // 4. Code Sandbox Artifact (e.g. for AVL Tree, DFS/BFS, Sorting, SQL)
  if (q.includes('avl') || q.includes('code') || q.includes('c++') || q.includes('java') || q.includes('python') || q.includes('dijkstra') || q.includes('sql') || q.includes('algorithm')) {
    const codeData: CodeSandboxData = {
      language: 'cpp',
      title: 'AVL Tree Self-Balancing Node Insertion',
      description: 'Production-ready C++ implementation of AVL Tree with LL, RR, LR, and RL rotation handling.',
      timeComplexity: 'O(log N) for Insert, Search & Delete',
      spaceComplexity: 'O(N) total space, O(log N) recursive stack',
      expectedOutput: 'Preorder traversal of constructed AVL tree:\n30 20 10 25 40 50\nBalance Factor after inserting 25: 0 (Balanced)',
      explanation: 'An AVL tree is a self-balancing binary search tree where the difference between heights of left and right subtrees (Balance Factor) cannot be more than 1 for all nodes.',
      code: `// MPDREC Academic Repository - KCS-401 (DSA)
// AVL Tree Implementation with Auto-Balancing Rotations

#include <iostream>
#include <algorithm>

using namespace std;

struct Node {
    int key;
    Node *left;
    Node *right;
    int height;
};

int getHeight(Node *n) {
    if (n == nullptr) return 0;
    return n->height;
}

int getBalanceFactor(Node *n) {
    if (n == nullptr) return 0;
    return getHeight(n->left) - getHeight(n->right);
}

Node* createNode(int key) {
    Node* node = new Node();
    node->key = key;
    node->left = nullptr;
    node->right = nullptr;
    node->height = 1;
    return node;
}

// Right Rotation (LL Case)
Node* rightRotate(Node *y) {
    Node *x = y->left;
    Node *T2 = x->right;

    x->right = y;
    y->left = T2;

    y->height = max(getHeight(y->left), getHeight(y->right)) + 1;
    x->height = max(getHeight(x->left), getHeight(x->right)) + 1;

    return x;
}

// Left Rotation (RR Case)
Node* leftRotate(Node *x) {
    Node *y = x->right;
    Node *T2 = y->left;

    y->left = x;
    x->right = T2;

    x->height = max(getHeight(x->left), getHeight(x->right)) + 1;
    y->height = max(getHeight(y->left), getHeight(y->right)) + 1;

    return y;
}

// Recursive Insert with Balance Factor restoration
Node* insert(Node* node, int key) {
    if (node == nullptr)
        return createNode(key);

    if (key < node->key)
        node->left = insert(node->left, key);
    else if (key > node->key)
        node->right = insert(node->right, key);
    else
        return node; // Duplicate keys not allowed

    node->height = 1 + max(getHeight(node->left), getHeight(node->right));
    int balance = getBalanceFactor(node);

    // Left Left Case
    if (balance > 1 && key < node->left->key)
        return rightRotate(node);

    // Right Right Case
    if (balance < -1 && key > node->right->key)
        return leftRotate(node);

    // Left Right Case
    if (balance > 1 && key > node->left->key) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }

    // Right Left Case
    if (balance < -1 && key < node->right->key) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }

    return node;
}

void preOrder(Node *root) {
    if (root != nullptr) {
        cout << root->key << " ";
        preOrder(root->left);
        preOrder(root->right);
    }
}`
    };

    return {
      id: `art-code-${Date.now()}`,
      type: 'code_sandbox',
      title: 'Interactive Code Sandbox: AVL Trees',
      subtitle: 'Self-balancing binary tree implementation with line trace',
      badge: 'C++ Code Sandbox',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      data: codeData
    };
  }

  // 5. Ordinance Document Artifact
  if (q.includes('ordinance') || q.includes('rule') || q.includes('regulation') || q.includes('attendance') || q.includes('hostel') || q.includes('detain') || q.includes('backlog')) {
    const ordinanceData: OrdinanceDocData = {
      clauseNumber: 'AKTU Ordinance Clause §3.2 & §5.4',
      title: 'Mandatory Minimum Attendance & Condonation Policy',
      category: 'Attendance',
      ordinanceYear: '2025-2026 Academic Gazette',
      officialText: 'Every student must attend at least 75% of total classes held in each subject (Lectures, Tutorials, and Practical Laboratories) in the semester to be eligible to appear in the University End-Semester Examinations.',
      practicalImplication: 'Students falling below 75% aggregate attendance will be classified as "Detained" in that specific course. Detained students receive an F grade and must re-register for the course in subsequent odd/even semesters.',
      reliefMechanism: 'The Director / Academic Dean, on the recommendation of the Department Head, may condone attendance shortages up to 15% (i.e. between 60% and 75%) strictly for certified medical illness (hospitalization records required within 3 working days) or participation in state/national academic or athletic competitions.'
    };

    return {
      id: `art-ord-${Date.now()}`,
      type: 'ordinance_doc',
      title: 'AKTU Ordinance §3.2 Gazette Extract',
      subtitle: 'Official legal attendance regulations & medical condonation clause',
      badge: 'Legal Gazette',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      data: ordinanceData
    };
  }

  return undefined;
}

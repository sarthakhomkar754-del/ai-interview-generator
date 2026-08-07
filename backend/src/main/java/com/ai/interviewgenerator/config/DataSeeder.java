package com.ai.interviewgenerator.config;

import com.ai.interviewgenerator.entity.*;
import com.ai.interviewgenerator.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TechnologyRepository technologyRepository;
    private final JobRoleRepository jobRoleRepository;
    private final ExperienceLevelRepository experienceLevelRepository;
    private final CategoryRepository categoryRepository;
    private final DifficultyRepository difficultyRepository;
    private final QuestionRepository questionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking database seeder initialization...");

        // 1. Seed Experience Levels
        seedExperienceLevel("Fresher");
        seedExperienceLevel("Intermediate");
        seedExperienceLevel("Experienced");

        // 2. Seed Categories
        seedCategory("Technical");
        seedCategory("Coding");
        seedCategory("SQL");
        seedCategory("HR");
        seedCategory("Aptitude");

        // 3. Seed Difficulties
        seedDifficulty("Easy");
        seedDifficulty("Medium");
        seedDifficulty("Hard");

        // 4. Seed Technologies
        Technology javaTech     = seedTechnology("Java",        "Core Java programming language concepts, JVM, OOP, collections, multithreading.");
        Technology springTech   = seedTechnology("Spring Boot", "Enterprise Java framework, Spring MVC, REST APIs, JPA, Security.");
        Technology reactTech    = seedTechnology("React",       "Frontend JavaScript library for component-based interactive user interfaces.");
        Technology pythonTech   = seedTechnology("Python",      "High-level dynamic programming language, data science, web development.");
        Technology sqlTech      = seedTechnology("SQL",         "Relational database querying, DDL, DML, joins, indexing, and optimization.");
        Technology nodeTech     = seedTechnology("NodeJS",      "Event-driven asynchronous JavaScript runtime for backend services.");
        Technology dockerTech   = seedTechnology("Docker",      "Containerization technology for packaging microservices and backend deployments.");

        // 5. Seed Job Roles
        JobRole javaDevRole     = seedJobRole("Java Developer",       "Backend development focused on Java and Spring Boot ecosystem.");
        JobRole fullstackRole   = seedJobRole("Full Stack Developer",  "End-to-end web application development covering React and Spring Boot.");
        JobRole frontendDevRole = seedJobRole("Frontend Developer",    "Client-side web development focused on React.js, HTML5, CSS3, and JS.");
        JobRole backendDevRole  = seedJobRole("Backend Developer",     "Server-side architecture, RESTful API design, database schemas, and performance.");
        JobRole qaRole          = seedJobRole("QA Engineer",           "Software quality assurance, automated testing, API testing, and bug tracking.");
        JobRole devopsRole      = seedJobRole("DevOps Engineer",       "CI/CD pipelines, container orchestration, Docker, cloud deployment, and monitoring.");

        // 6. Seed Users
        userRepository.findByEmail("admin@interview.com").orElseGet(() -> {
            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@interview.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ROLE_ADMIN")
                    .build();
            return userRepository.save(admin);
        });

        User stdUser = userRepository.findByEmail("user@interview.com").orElseGet(() -> {
            User user = User.builder()
                    .name("John Doe")
                    .email("user@interview.com")
                    .password(passwordEncoder.encode("user123"))
                    .role("ROLE_USER")
                    .build();
            return userRepository.save(user);
        });

        userRepository.findByEmail("sarthak@gmail.com").orElseGet(() -> {
            User user = User.builder()
                    .name("Sarthak")
                    .email("sarthak@gmail.com")
                    .password(passwordEncoder.encode("user123"))
                    .role("ROLE_USER")
                    .build();
            return userRepository.save(user);
        });

        // 7. Seed Questions if below threshold (allows re-seed after upgrade)
        if (questionRepository.count() < 40) {
            log.info("Seeding category-specific interview questions...");

            ExperienceLevel fresher      = experienceLevelRepository.findByLevelNameIgnoreCase("Fresher").get();
            ExperienceLevel intermediate = experienceLevelRepository.findByLevelNameIgnoreCase("Intermediate").get();
            ExperienceLevel experienced  = experienceLevelRepository.findByLevelNameIgnoreCase("Experienced").get();

            Category technical = categoryRepository.findByCategoryNameIgnoreCase("Technical").get();
            Category coding    = categoryRepository.findByCategoryNameIgnoreCase("Coding").get();
            Category sqlCat    = categoryRepository.findByCategoryNameIgnoreCase("SQL").get();
            Category hr        = categoryRepository.findByCategoryNameIgnoreCase("HR").get();
            Category aptitude  = categoryRepository.findByCategoryNameIgnoreCase("Aptitude").get();

            Difficulty easy   = difficultyRepository.findByDifficultyNameIgnoreCase("Easy").get();
            Difficulty medium = difficultyRepository.findByDifficultyNameIgnoreCase("Medium").get();
            Difficulty hard   = difficultyRepository.findByDifficultyNameIgnoreCase("Hard").get();

            User creator = stdUser;

            // ═══════════════════════════════════════════════
            // TECHNICAL — Java
            // ═══════════════════════════════════════════════
            createQuestion("What is the difference between HashMap and ConcurrentHashMap in Java?",
                    "HashMap is not thread-safe and allows null keys/values. ConcurrentHashMap is thread-safe using segment-level locking (Java 7) or bucket-level CAS (Java 8+). ConcurrentHashMap disallows null keys or values.",
                    javaTech, javaDevRole, intermediate, technical, medium, creator);

            createQuestion("Explain the internal working of Java Garbage Collection.",
                    "Garbage Collection automatically frees unreferenced heap memory. The heap is divided into Young Generation (Eden + Survivor S0/S1) and Old/Tenured Generation. Algorithms include G1GC, ZGC, and Parallel GC using mark-sweep-compact phases.",
                    javaTech, javaDevRole, experienced, technical, hard, creator);

            createQuestion("What is the difference between interface and abstract class in Java?",
                    "Interface: all methods are implicitly public and abstract (pre Java 8), supports multiple inheritance. Abstract class: can have concrete methods, constructor, state fields. Use interface for type contract, abstract class for shared base behavior.",
                    javaTech, javaDevRole, fresher, technical, easy, creator);

            createQuestion("What are Java Stream API features and when should you use them?",
                    "Stream API (Java 8+) enables declarative functional processing of collections. Key operations: filter, map, flatMap, reduce, collect. Use for concise pipeline processing of data, parallel streams for CPU-bound tasks, avoid side-effect-heavy lambdas.",
                    javaTech, fullstackRole, intermediate, technical, medium, creator);

            // TECHNICAL — Spring Boot
            createQuestion("How does Spring Boot auto-configuration work?",
                    "Spring Boot auto-configuration uses @EnableAutoConfiguration scanning spring.factories / AutoConfiguration.imports to register pre-built configuration beans conditionally based on classpath dependencies using @ConditionalOnClass/@ConditionalOnMissingBean.",
                    springTech, backendDevRole, intermediate, technical, medium, creator);

            createQuestion("What is the difference between @Component, @Service, and @Repository in Spring?",
                    "@Component is the generic Spring-managed stereotype. @Service annotates business logic. @Repository annotates DAOs and translates database exceptions to Spring's DataAccessException hierarchy via PersistenceExceptionTranslationPostProcessor.",
                    springTech, backendDevRole, fresher, technical, easy, creator);

            createQuestion("Explain Spring Boot Security JWT authentication flow.",
                    "Flow: User logs in → AuthController returns JWT → Client stores JWT → Each request sends JWT in Authorization header → JwtAuthFilter validates token → Extracts username → Loads UserDetails → Sets SecurityContext → Controller executes.",
                    springTech, backendDevRole, experienced, technical, hard, creator);

            // TECHNICAL — React
            createQuestion("Explain Virtual DOM in React.js and how Reconciliation works.",
                    "Virtual DOM is a lightweight in-memory copy of the real DOM. React uses a diffing algorithm during Reconciliation to identify minimal DOM mutations required when state/props change, batching real DOM updates for efficiency.",
                    reactTech, frontendDevRole, intermediate, technical, medium, creator);

            createQuestion("What are React Hooks? Explain useState and useEffect.",
                    "React Hooks allow functional components to use state and lifecycle. useState manages local state. useEffect replaces componentDidMount/componentDidUpdate/componentWillUnmount — runs after render, cleanup via return function. Rules: only at top level, only in React functions.",
                    reactTech, frontendDevRole, fresher, technical, easy, creator);

            // TECHNICAL — Python
            createQuestion("What is GIL (Global Interpreter Lock) in Python?",
                    "CPython's GIL is a mutex allowing only one native thread to execute Python bytecode at a time. It prevents true parallel execution of CPU-bound threads. Use multiprocessing module or async I/O (asyncio) for concurrency instead of threading.",
                    pythonTech, backendDevRole, experienced, technical, hard, creator);

            // TECHNICAL — Docker
            createQuestion("How do Docker containers differ from Virtual Machines?",
                    "Docker containers share the host OS kernel and isolate at the process level (lightweight, MBs, fast startup). VMs virtualize entire hardware with guest OS (heavy, GBs, slow boot). Containers use namespaces and cgroups for isolation.",
                    dockerTech, devopsRole, intermediate, technical, easy, creator);

            // ═══════════════════════════════════════════════
            // SQL QUESTIONS
            // ═══════════════════════════════════════════════
            createQuestion("Write a SQL query to find the 2nd highest salary from an Employee table.",
                    "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee); OR: WITH Ranked AS (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk FROM Employee) SELECT DISTINCT salary FROM Ranked WHERE rnk = 2;",
                    sqlTech, fullstackRole, intermediate, sqlCat, medium, creator);

            createQuestion("Explain the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN.",
                    "INNER JOIN: returns only matching rows from both tables. LEFT JOIN: all rows from left table + matching from right (NULL if no match). RIGHT JOIN: all rows from right table + matching from left (NULL if no match). FULL OUTER JOIN: all rows from both.",
                    sqlTech, fullstackRole, fresher, sqlCat, easy, creator);

            createQuestion("What is SQL normalization? Explain 1NF, 2NF, 3NF.",
                    "1NF: atomic column values, no repeating groups. 2NF: 1NF + no partial dependency on composite primary key. 3NF: 2NF + no transitive dependency (non-key columns must depend only on the primary key, not on other non-key columns).",
                    sqlTech, backendDevRole, intermediate, sqlCat, medium, creator);

            createQuestion("What is the difference between DELETE, TRUNCATE, and DROP in SQL?",
                    "DELETE: removes specific rows with WHERE clause, can be rolled back, fires triggers, DML operation. TRUNCATE: removes all rows, faster, usually not fully rollbackable, DDL. DROP: removes the entire table structure and data permanently, DDL.",
                    sqlTech, fullstackRole, fresher, sqlCat, easy, creator);

            createQuestion("Write a SQL query to find duplicate records in a table.",
                    "SELECT email, COUNT(*) as cnt FROM users GROUP BY email HAVING COUNT(*) > 1; To delete duplicates: DELETE FROM users WHERE id NOT IN (SELECT MIN(id) FROM users GROUP BY email);",
                    sqlTech, backendDevRole, intermediate, sqlCat, medium, creator);

            createQuestion("What are SQL indexes and when should you avoid using them?",
                    "Indexes speed up SELECT queries by creating a lookup data structure (B-Tree). Avoid on: small tables, columns with high NULL %, heavily updated columns (too much write overhead), low-cardinality columns like boolean flags.",
                    sqlTech, backendDevRole, experienced, sqlCat, hard, creator);

            createQuestion("Explain ACID properties of database transactions.",
                    "Atomicity: all operations succeed or none do (rollback on failure). Consistency: DB moves from one valid state to another. Isolation: concurrent transactions don't interfere. Durability: committed data persists even after system failure.",
                    sqlTech, javaDevRole, intermediate, sqlCat, medium, creator);

            createQuestion("What is a SQL subquery vs a JOIN? When to use each?",
                    "Subquery: a query nested inside another query (in WHERE/FROM/SELECT). JOIN: combines rows from two tables. Use JOIN for better performance on large datasets. Use subquery for complex filtering or when result depends on aggregation of another table.",
                    sqlTech, fullstackRole, intermediate, sqlCat, medium, creator);

            // ═══════════════════════════════════════════════
            // APTITUDE QUESTIONS (Calculations/Logic)
            // ═══════════════════════════════════════════════
            createQuestion("If a train travels 360 km in 4 hours, what is its speed in km/h?",
                    "Speed = Distance / Time = 360 / 4 = 90 km/h.",
                    javaTech, javaDevRole, fresher, aptitude, easy, creator);

            createQuestion("A number increased by 20% gives 144. What is the original number?",
                    "Let original number = x. Then x × 1.20 = 144. So x = 144 / 1.2 = 120.",
                    javaTech, fullstackRole, fresher, aptitude, easy, creator);

            createQuestion("Two pipes A and B fill a tank in 10 hours and 15 hours respectively. How long will they take together?",
                    "Rate of A = 1/10 per hour, Rate of B = 1/15 per hour. Combined rate = 1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6. Time = 6 hours.",
                    springTech, backendDevRole, fresher, aptitude, medium, creator);

            createQuestion("In how many ways can 4 people be seated in a row of 4 chairs?",
                    "This is a permutation problem. P(4,4) = 4! = 4 × 3 × 2 × 1 = 24 ways.",
                    reactTech, frontendDevRole, fresher, aptitude, easy, creator);

            createQuestion("If 6 workers complete a job in 8 days, how many days will 4 workers take?",
                    "Total work = 6 × 8 = 48 person-days. With 4 workers: Days = 48 / 4 = 12 days.",
                    sqlTech, fullstackRole, fresher, aptitude, medium, creator);

            createQuestion("What is 15% of 80 plus 25% of 60?",
                    "15% of 80 = 0.15 × 80 = 12. 25% of 60 = 0.25 × 60 = 15. Total = 12 + 15 = 27.",
                    nodeTech, backendDevRole, fresher, aptitude, easy, creator);

            createQuestion("The ratio of boys to girls in a class is 3:2. If there are 30 boys, how many girls are there?",
                    "Ratio is 3:2. Boys = 30. Girls = 30 × (2/3) = 20 girls. Total = 50 students.",
                    pythonTech, javaDevRole, fresher, aptitude, easy, creator);

            createQuestion("Find the LCM of 12, 18, and 24.",
                    "12 = 2² × 3, 18 = 2 × 3², 24 = 2³ × 3. LCM = 2³ × 3² = 8 × 9 = 72.",
                    javaTech, backendDevRole, fresher, aptitude, medium, creator);

            createQuestion("A shopkeeper marks a product 25% above cost and offers 10% discount. What is the profit%?",
                    "Let cost = 100. Marked price = 125. After 10% discount: 125 × 0.9 = 112.5. Profit = 112.5 - 100 = 12.5. Profit% = 12.5%.",
                    springTech, fullstackRole, intermediate, aptitude, medium, creator);

            createQuestion("A can complete a work in 12 days, B in 18 days. If they work together for 4 days, what fraction of work remains?",
                    "Combined rate = 1/12 + 1/18 = 3/36 + 2/36 = 5/36 per day. Work in 4 days = 4 × 5/36 = 20/36 = 5/9. Remaining = 1 - 5/9 = 4/9.",
                    reactTech, fullstackRole, intermediate, aptitude, hard, creator);

            createQuestion("A car depreciates at 10% per annum. What is its value after 2 years if it costs Rs. 1,00,000?",
                    "After year 1: 1,00,000 × 0.9 = 90,000. After year 2: 90,000 × 0.9 = 81,000. Value = Rs. 81,000.",
                    javaTech, javaDevRole, fresher, aptitude, easy, creator);

            createQuestion("The average of 5 numbers is 20. If one number is excluded, the average becomes 18. What is the excluded number?",
                    "Sum of 5 numbers = 5 × 20 = 100. Sum of remaining 4 = 4 × 18 = 72. Excluded number = 100 - 72 = 28.",
                    sqlTech, backendDevRole, intermediate, aptitude, medium, creator);

            createQuestion("A is 40% faster than B. If B finishes a race in 35 minutes, when does A finish?",
                    "A's speed = 1.4 × B's speed. Time is inversely proportional to speed. A's time = 35 / 1.4 = 25 minutes.",
                    nodeTech, devopsRole, intermediate, aptitude, hard, creator);

            // ═══════════════════════════════════════════════
            // CODING QUESTIONS
            // ═══════════════════════════════════════════════
            createQuestion("Write a Java function to reverse a String without using built-in reverse().",
                    "public String reverse(String s) { StringBuilder sb = new StringBuilder(); for(int i=s.length()-1; i>=0; i--) sb.append(s.charAt(i)); return sb.toString(); }",
                    javaTech, javaDevRole, fresher, coding, easy, creator);

            createQuestion("Implement Floyd's cycle detection to find a loop in a singly linked list.",
                    "Use two pointers: slow (1 step) and fast (2 steps). If fast meets slow, a cycle exists. If fast reaches null, no loop. O(n) time, O(1) space.",
                    javaTech, fullstackRole, intermediate, coding, medium, creator);

            createQuestion("Write a function to check if a string is a palindrome.",
                    "boolean isPalindrome(String s) { int l=0, r=s.length()-1; while(l<r) { if(s.charAt(l)!=s.charAt(r)) return false; l++; r--; } return true; }",
                    javaTech, javaDevRole, fresher, coding, easy, creator);

            createQuestion("Implement binary search algorithm.",
                    "int binarySearch(int[] arr, int target) { int l=0, r=arr.length-1; while(l<=r) { int m=l+(r-l)/2; if(arr[m]==target) return m; else if(arr[m]<target) l=m+1; else r=m-1; } return -1; }",
                    javaTech, backendDevRole, intermediate, coding, medium, creator);

            createQuestion("How do you find the first non-repeating character in a string?",
                    "Use a LinkedHashMap to count frequencies. Iterate the string, inserting characters with their count. Then iterate the map and return the first key with count == 1. Time O(n), Space O(1) since at most 26 keys.",
                    springTech, fullstackRole, intermediate, coding, medium, creator);

            createQuestion("Write code to detect if two strings are anagrams of each other.",
                    "Sort both strings and compare (O(n log n)), OR use a frequency array of size 26 — increment for s1 characters, decrement for s2, then check all are zero. O(n) time, O(1) space.",
                    reactTech, frontendDevRole, fresher, coding, easy, creator);

            createQuestion("Implement merge sort algorithm.",
                    "Recursively divide array into halves until single elements. Merge sorted halves: compare elements of both halves and place smallest first. Time O(n log n), Space O(n). Stable sort.",
                    javaTech, backendDevRole, experienced, coding, hard, creator);

            createQuestion("Write a function to find all pairs in an array that sum to a target value.",
                    "Use a HashSet: for each num, check if (target - num) is in the set. If yes, found a pair. If no, add num to the set. O(n) time, O(n) space.",
                    javaTech, fullstackRole, intermediate, coding, medium, creator);

            // ═══════════════════════════════════════════════
            // HR QUESTIONS
            // ═══════════════════════════════════════════════
            createQuestion("Tell me about yourself as a software developer.",
                    "Structure: Present (current skills and tech stack), Past (key projects and achievements), Future (why this role aligns with career goals). Keep it under 2 minutes, professional, and relevant to the JD.",
                    javaTech, fullstackRole, fresher, hr, easy, creator);

            createQuestion("Where do you see yourself in 5 years as a Software Engineer?",
                    "Show ambition aligned with growth: senior developer → tech lead → architect. Mention mentoring juniors, leading technical decisions, continuous learning (certifications, open source), and delivering impactful scalable products.",
                    springTech, javaDevRole, fresher, hr, easy, creator);

            createQuestion("Tell me about a time you resolved a major conflict within your engineering team.",
                    "Use STAR method: Situation (describe the conflict), Task (your role), Action (how you mediated — data-driven discussion, active listening, finding common ground), Result (resolved conflict, improved team dynamics, shipped on time).",
                    javaTech, fullstackRole, experienced, hr, medium, creator);

            createQuestion("Describe a challenging project and how you handled it.",
                    "Use STAR: pick a project with real complexity (tight deadline, new tech, unclear requirements). Focus on your specific contributions, how you broke down problems, sought help when needed, and the positive outcome delivered.",
                    springTech, backendDevRole, intermediate, hr, medium, creator);

            createQuestion("How do you handle constructive criticism from your manager or peers?",
                    "Acknowledge the feedback with openness. Ask clarifying questions to understand the root concern. Create an action plan to address it. Follow up after improvement. Avoid being defensive — treat it as a growth opportunity.",
                    reactTech, frontendDevRole, fresher, hr, easy, creator);

            log.info("Database seeding completed with {} questions!", questionRepository.count());
        }
    }

    private void seedExperienceLevel(String name) {
        if (experienceLevelRepository.findByLevelNameIgnoreCase(name).isEmpty()) {
            experienceLevelRepository.save(ExperienceLevel.builder().levelName(name).build());
        }
    }

    private void seedCategory(String name) {
        if (!categoryRepository.existsByCategoryNameIgnoreCase(name)) {
            categoryRepository.save(Category.builder().categoryName(name).build());
        }
    }

    private void seedDifficulty(String name) {
        if (difficultyRepository.findByDifficultyNameIgnoreCase(name).isEmpty()) {
            difficultyRepository.save(Difficulty.builder().difficultyName(name).build());
        }
    }

    private Technology seedTechnology(String name, String desc) {
        return technologyRepository.findByTechnologyNameIgnoreCase(name).orElseGet(() ->
                technologyRepository.save(Technology.builder().technologyName(name).description(desc).build())
        );
    }

    private JobRole seedJobRole(String name, String desc) {
        return jobRoleRepository.findByRoleNameIgnoreCase(name).orElseGet(() ->
                jobRoleRepository.save(JobRole.builder().roleName(name).description(desc).build())
        );
    }

    private void createQuestion(String text, String answer, Technology tech, JobRole role,
                                 ExperienceLevel level, Category category, Difficulty difficulty, User creator) {
        Question question = Question.builder()
                .question(text)
                .answer(answer)
                .technology(tech)
                .jobRole(role)
                .experienceLevel(level)
                .category(category)
                .difficulty(difficulty)
                .createdBy(creator)
                .build();
        questionRepository.save(question);
    }
}

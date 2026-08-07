package com.ai.interviewgenerator.service;

import com.ai.interviewgenerator.dto.GenerateQuestionRequest;
import com.ai.interviewgenerator.dto.QuestionDTO;
import com.ai.interviewgenerator.entity.*;
import com.ai.interviewgenerator.exception.ResourceNotFoundException;
import com.ai.interviewgenerator.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final TechnologyRepository technologyRepository;
    private final JobRoleRepository jobRoleRepository;
    private final ExperienceLevelRepository experienceLevelRepository;
    private final CategoryRepository categoryRepository;
    private final DifficultyRepository difficultyRepository;
    private final UserRepository userRepository;
    private final FavoriteQuestionRepository favoriteQuestionRepository;
    private final GeneratedHistoryRepository generatedHistoryRepository;

    @Override
    public List<QuestionDTO> generateQuestions(String currentUserEmail, GenerateQuestionRequest request) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Technology tech = request.getTechnologyId() != null ?
                technologyRepository.findById(request.getTechnologyId()).orElse(null) : null;

        JobRole role = request.getJobRoleId() != null ?
                jobRoleRepository.findById(request.getJobRoleId()).orElse(null) : null;

        ExperienceLevel level = request.getExperienceLevelId() != null ?
                experienceLevelRepository.findById(request.getExperienceLevelId()).orElse(null) : null;

        Category category = request.getCategoryId() != null ?
                categoryRepository.findById(request.getCategoryId()).orElse(null) : null;

        Difficulty difficulty = request.getDifficultyId() != null ?
                difficultyRepository.findById(request.getDifficultyId()).orElse(null) : null;

        // Save generation session to history
        GeneratedHistory history = GeneratedHistory.builder()
                .user(user)
                .technology(tech)
                .jobRole(role)
                .experienceLevel(level)
                .category(category)
                .difficulty(difficulty)
                .questionCount(request.getCount())
                .build();
        generatedHistoryRepository.save(history);

        // Fetch matching questions from database (wrap in modifiable ArrayList)
        List<Question> matchingQuestions = new ArrayList<>(questionRepository.filterQuestions(
                tech != null ? tech.getId() : null,
                role != null ? role.getId() : null,
                level != null ? level.getId() : null,
                category != null ? category.getId() : null,
                difficulty != null ? difficulty.getId() : null,
                null
        ));

        int targetCount = request.getCount() != null ? request.getCount() : 5;

        // Fallback 1: Broaden to tech + category (relax role & level, keep category)
        if (matchingQuestions.size() < targetCount && tech != null) {
            List<Question> fallback1 = questionRepository.filterQuestions(
                    tech.getId(), null, null,
                    category != null ? category.getId() : null,
                    null, null
            );
            for (Question q : fallback1) {
                if (!matchingQuestions.contains(q) && matchingQuestions.size() < targetCount) {
                    matchingQuestions.add(q);
                }
            }
        }

        // Fallback 2: Category only (any tech) — ensures category filter is always respected
        if (matchingQuestions.size() < targetCount && category != null) {
            List<Question> fallback2 = questionRepository.filterQuestions(
                    null, null, null, category.getId(), null, null
            );
            for (Question q : fallback2) {
                if (!matchingQuestions.contains(q) && matchingQuestions.size() < targetCount) {
                    matchingQuestions.add(q);
                }
            }
        }

        // Fallback 3: Synthesize dynamic questions (category-aware content)
        if (matchingQuestions.size() < targetCount) {
            int needed = targetCount - matchingQuestions.size();
            List<Question> generatedAIQuestions = generateAIQuestions(tech, role, level, category, difficulty, user, needed);
            matchingQuestions.addAll(generatedAIQuestions);
        }

        // Shuffle & limit to requested count
        Collections.shuffle(matchingQuestions);
        List<Question> result = matchingQuestions.stream().limit(targetCount).toList();

        Set<Long> userFavoriteIds = getUserFavoriteQuestionIds(user.getId());

        return result.stream()
                .map(q -> mapToDTO(q, userFavoriteIds.contains(q.getId())))
                .collect(Collectors.toList());
    }

    @Override
    public List<QuestionDTO> filterQuestions(Long techId, Long jobRoleId, Long expLevelId, Long categoryId, Long difficultyId, String search, String currentUserEmail) {
        Long userId = null;
        if (currentUserEmail != null) {
            userRepository.findByEmail(currentUserEmail).ifPresent(u -> {});
        }

        List<Question> questions = questionRepository.filterQuestions(techId, jobRoleId, expLevelId, categoryId, difficultyId, search);

        Set<Long> userFavoriteIds = Collections.emptySet();
        if (currentUserEmail != null) {
            Optional<User> uOpt = userRepository.findByEmail(currentUserEmail);
            if (uOpt.isPresent()) {
                userFavoriteIds = getUserFavoriteQuestionIds(uOpt.get().getId());
            }
        }

        final Set<Long> favs = userFavoriteIds;
        return questions.stream()
                .map(q -> mapToDTO(q, favs.contains(q.getId())))
                .toList();
    }

    @Override
    public QuestionDTO getQuestionById(Long id, String currentUserEmail) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));

        boolean isFav = false;
        if (currentUserEmail != null) {
            Optional<User> uOpt = userRepository.findByEmail(currentUserEmail);
            if (uOpt.isPresent()) {
                isFav = favoriteQuestionRepository.existsByUserIdAndQuestionId(uOpt.get().getId(), q.getId());
            }
        }
        return mapToDTO(q, isFav);
    }

    @Override
    public QuestionDTO createQuestion(QuestionDTO dto, String creatorEmail) {
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Creator not found"));

        Technology tech = technologyRepository.findById(dto.getTechnologyId())
                .orElseThrow(() -> new ResourceNotFoundException("Technology not found"));

        JobRole role = jobRoleRepository.findById(dto.getJobRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Job role not found"));

        ExperienceLevel level = experienceLevelRepository.findById(dto.getExperienceLevelId())
                .orElseThrow(() -> new ResourceNotFoundException("Experience level not found"));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Difficulty difficulty = difficultyRepository.findById(dto.getDifficultyId())
                .orElseThrow(() -> new ResourceNotFoundException("Difficulty not found"));

        Question question = Question.builder()
                .question(dto.getQuestion())
                .answer(dto.getAnswer())
                .technology(tech)
                .jobRole(role)
                .experienceLevel(level)
                .category(category)
                .difficulty(difficulty)
                .createdBy(creator)
                .build();

        Question saved = questionRepository.save(question);
        return mapToDTO(saved, false);
    }

    @Override
    public QuestionDTO updateQuestion(Long id, QuestionDTO dto) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));

        Technology tech = technologyRepository.findById(dto.getTechnologyId())
                .orElseThrow(() -> new ResourceNotFoundException("Technology not found"));

        JobRole role = jobRoleRepository.findById(dto.getJobRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Job role not found"));

        ExperienceLevel level = experienceLevelRepository.findById(dto.getExperienceLevelId())
                .orElseThrow(() -> new ResourceNotFoundException("Experience level not found"));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Difficulty difficulty = difficultyRepository.findById(dto.getDifficultyId())
                .orElseThrow(() -> new ResourceNotFoundException("Difficulty not found"));

        q.setQuestion(dto.getQuestion());
        q.setAnswer(dto.getAnswer());
        q.setTechnology(tech);
        q.setJobRole(role);
        q.setExperienceLevel(level);
        q.setCategory(category);
        q.setDifficulty(difficulty);

        Question updated = questionRepository.save(q);
        return mapToDTO(updated, false);
    }

    @Override
    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Question not found with id: " + id);
        }
        questionRepository.deleteById(id);
    }

    private Set<Long> getUserFavoriteQuestionIds(Long userId) {
        return favoriteQuestionRepository.findByUserIdOrderBySavedAtDesc(userId)
                .stream()
                .map(fq -> fq.getQuestion().getId())
                .collect(Collectors.toSet());
    }



    private QuestionDTO mapToDTO(Question q, boolean isFav) {
        List<String> optionsBefore = new ArrayList<>();
        String ans = q.getAnswer();
        String summary = ans.length() > 120 ? ans.substring(0, 117) + "..." : ans;
        optionsBefore.add(summary);

        String catName = q.getCategory() != null ? q.getCategory().getCategoryName().toLowerCase() : "technical";
        if (catName.equals("aptitude")) {
            optionsBefore.add("The result depends only on whether the number is a prime or composite value.");
            optionsBefore.add("The answer is always the square root of the given input divided by 2.");
            optionsBefore.add("There is no definitive solution; the answer changes based on the data set.");
        } else if (catName.equals("sql")) {
            optionsBefore.add("Use a CROSS JOIN with a subquery to eliminate duplicate values from both tables.");
            optionsBefore.add("Use a FULL OUTER JOIN combined with HAVING COUNT(*) > 1 to filter duplicate rows.");
            optionsBefore.add("Execute a GROUP BY clause with ROLLUP modifier to produce hierarchical aggregations.");
        } else if (catName.equals("coding")) {
            optionsBefore.add("Use a nested for-loop with O(n²) complexity and sort the array before processing.");
            optionsBefore.add("Recursively divide the problem into halves, processing only even-indexed elements.");
            optionsBefore.add("Traverse the data structure in reverse order using a stack-based depth-first approach.");
        } else if (catName.equals("hr")) {
            optionsBefore.add("Always prioritize personal deadlines over team collaboration and communication.");
            optionsBefore.add("Avoid conflicts entirely by delegating all challenging decisions to management.");
            optionsBefore.add("Focus exclusively on technical metrics and avoid discussing soft skills.");
        } else {
            optionsBefore.add("It is a design pattern used exclusively for singleton object instantiation in distributed systems.");
            optionsBefore.add("It replaces all virtual machine memory management and disables the garbage collector.");
            optionsBefore.add("It is a deprecated API available only in legacy versions of the framework.");
        }

        // Shuffle options but track where correct answer (index 0) lands
        List<Integer> indices = new ArrayList<>(Arrays.asList(0, 1, 2, 3));
        Collections.shuffle(indices, new Random(q.getId()));
        List<String> shuffledOpts = new ArrayList<>();
        int correctIdx = 0;
        for (int i = 0; i < indices.size(); i++) {
            shuffledOpts.add(optionsBefore.get(indices.get(i)));
            if (indices.get(i) == 0) correctIdx = i;
        }

        return QuestionDTO.builder()
                .id(q.getId())
                .question(q.getQuestion())
                .answer(q.getAnswer())
                .technologyId(q.getTechnology() != null ? q.getTechnology().getId() : null)
                .technologyName(q.getTechnology() != null ? q.getTechnology().getTechnologyName() : "General")
                .jobRoleId(q.getJobRole() != null ? q.getJobRole().getId() : null)
                .jobRoleName(q.getJobRole() != null ? q.getJobRole().getRoleName() : "General")
                .experienceLevelId(q.getExperienceLevel() != null ? q.getExperienceLevel().getId() : null)
                .experienceLevelName(q.getExperienceLevel() != null ? q.getExperienceLevel().getLevelName() : "General")
                .categoryId(q.getCategory() != null ? q.getCategory().getId() : null)
                .categoryName(q.getCategory() != null ? q.getCategory().getCategoryName() : "General")
                .difficultyId(q.getDifficulty() != null ? q.getDifficulty().getId() : null)
                .difficultyName(q.getDifficulty() != null ? q.getDifficulty().getDifficultyName() : "Medium")
                .isFavorite(isFav)
                .options(shuffledOpts)
                .correctOptionIndex(correctIdx)
                .createdAt(q.getCreatedAt())
                .build();
    }

    private List<Question> generateAIQuestions(Technology tech, JobRole role, ExperienceLevel level, Category category, Difficulty difficulty, User creator, int count) {
        Category catToUse = category != null ? category : categoryRepository.findByCategoryNameIgnoreCase("Technical").orElse(categoryRepository.findAll().get(0));
        Difficulty diffToUse = difficulty != null ? difficulty : difficultyRepository.findByDifficultyNameIgnoreCase("Medium").orElse(difficultyRepository.findAll().get(0));

        String techName = tech != null ? tech.getTechnologyName() : "General";
        String roleName = role != null ? role.getRoleName() : "General";
        String levelName = level != null ? level.getLevelName() : "General";

        String catName = catToUse.getCategoryName().toLowerCase();
        List<Question> newQuestions = new ArrayList<>();

        // Category-specific question templates
        String[][] qaByCategory = getCategorySpecificQA(catName, techName, roleName, levelName);

        for (int i = 0; i < count; i++) {
            int idx = i % qaByCategory.length;
            Question q = Question.builder()
                    .question(qaByCategory[idx][0])
                    .answer(qaByCategory[idx][1])
                    .technology(tech)
                    .jobRole(role)
                    .experienceLevel(level)
                    .category(catToUse)
                    .difficulty(diffToUse)
                    .createdBy(creator)
                    .build();
            newQuestions.add(questionRepository.save(q));
        }
        return newQuestions;
    }

    private String[][] getCategorySpecificQA(String catName, String techName, String roleName, String levelName) {
        switch (catName) {
            case "aptitude":
                return new String[][]{
                    {"If a train travels 360 km in 4 hours, what is its speed in km/h?", "Speed = Distance / Time = 360 / 4 = 90 km/h."},
                    {"A number increased by 20% becomes 144. What is the original number?", "Let x be the original. x * 1.20 = 144, so x = 144 / 1.2 = 120."},
                    {"Two pipes A and B fill a tank in 10 hrs and 15 hrs. How long to fill together?", "Combined rate = 1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6. Time = 6 hours."},
                    {"In how many ways can 4 people sit in a row of 4 chairs?", "Permutations = 4! = 4 × 3 × 2 × 1 = 24 ways."},
                    {"If 6 workers complete a job in 8 days, how many days do 4 workers take?", "Work = 6×8 = 48 person-days. Days for 4 workers = 48/4 = 12 days."},
                    {"A man walks at 4 km/h and cycles at 12 km/h. He covers 48 km in 6 hours. How long did he cycle?", "Let cycling time = t. 12t + 4(6-t) = 48. 12t + 24 - 4t = 48. 8t = 24. t = 3 hours."},
                    {"What is 15% of 80 plus 25% of 60?", "15% of 80 = 12. 25% of 60 = 15. Total = 12 + 15 = 27."},
                    {"The ratio of boys to girls in a class is 3:2. If there are 30 boys, how many girls are there?", "Girls = 30 × (2/3) = 20 girls."},
                    {"Find the LCM of 12, 18, and 24.", "Prime factorization: 12=2²×3, 18=2×3², 24=2³×3. LCM = 2³×3² = 8×9 = 72."},
                    {"A car depreciates 10% per year. What is its value after 2 years if it costs Rs. 1,00,000?", "After 1st year: 1,00,000 × 0.9 = 90,000. After 2nd year: 90,000 × 0.9 = 81,000."}
                };
            case "sql":
                return new String[][]{
                    {"Write a SQL query to find all employees who earn more than the average salary.", "SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);"},
                    {"How do you find duplicate rows in a table?", "SELECT column_name, COUNT(*) FROM table_name GROUP BY column_name HAVING COUNT(*) > 1;"},
                    {"What is a SQL TRANSACTION and what are ACID properties?", "A transaction is a logical unit of work. ACID: Atomicity (all or nothing), Consistency (valid state), Isolation (transactions don't interfere), Durability (committed data persists)."},
                    {"Write a query to get the top 3 highest salaries per department.", "SELECT dept_id, emp_name, salary FROM employees e WHERE 3 > (SELECT COUNT(DISTINCT salary) FROM employees WHERE dept_id = e.dept_id AND salary > e.salary) ORDER BY dept_id, salary DESC;"},
                    {"What is the difference between DELETE, TRUNCATE, and DROP?", "DELETE removes specific rows with a WHERE clause and can be rolled back. TRUNCATE removes all rows quickly (no WHERE, cannot always rollback). DROP deletes the entire table structure permanently."},
                    {"Explain normalization: 1NF, 2NF, 3NF.", "1NF: atomic values, no repeating groups. 2NF: 1NF + no partial dependency on composite PK. 3NF: 2NF + no transitive dependency (non-key attributes don't depend on other non-key attributes)."}
                };
            case "coding":
                return new String[][]{
                    {"Write a " + techName + " function to check if a string is a palindrome.", "boolean isPalindrome(String s) { int l=0, r=s.length()-1; while(l<r){ if(s.charAt(l)!=s.charAt(r)) return false; l++; r--; } return true; }"},
                    {"Implement binary search in " + techName + ".", "int binarySearch(int[] arr, int t){ int l=0,r=arr.length-1; while(l<=r){ int m=l+(r-l)/2; if(arr[m]==t) return m; else if(arr[m]<t) l=m+1; else r=m-1; } return -1; }"},
                    {"Write a function to find the factorial of a number using recursion.", "int factorial(int n){ return n<=1 ? 1 : n * factorial(n-1); } — Iterative is preferred for large n to avoid stack overflow."},
                    {"How would you find the first non-repeating character in a string?", "Traverse the string, store character frequency in a LinkedHashMap, then return the first character with count == 1."},
                    {"Implement a stack using two queues.", "Push: enqueue to Q1. Pop: Move all elements from Q1 to Q2 except last, dequeue last from Q1. Swap Q1 and Q2 references."},
                    {"Write code to detect if two strings are anagrams.", "Sort both strings and compare, OR count character frequencies using a HashMap/array of size 26 and compare the frequency arrays."}
                };
            case "hr":
                return new String[][]{
                    {"Tell me about yourself as a " + roleName + ".", "Structure your answer: Present (current role/skills), Past (relevant experience), Future (why this role). Keep it concise, professional, and tied to the job description."},
                    {"Describe a challenging project you worked on and how you handled it.", "Use the STAR method: Situation (project context), Task (your responsibility), Action (specific steps you took), Result (measurable outcome/impact)."},
                    {"Why do you want to work as a " + roleName + " at our company?", "Research the company's values, products, and culture. Align your answer with your career goals and explain how your skills directly add value to their team."},
                    {"How do you handle tight deadlines and multiple priorities?", "Explain using a real scenario: prioritize tasks by urgency/impact matrix, communicate blockers early, break large tasks into sprints, and maintain consistent daily standups."},
                    {"Where do you see yourself in the next 3-5 years?", "Show ambition: technical leadership or architecture role. Demonstrate commitment to continuous learning, mentoring juniors, and delivering scalable solutions."},
                    {"How do you handle disagreements with your team members or manager?", "Focus on constructive resolution: present facts and data objectively, actively listen to other perspectives, seek a compromise aligned with project goals, and escalate only when needed."}
                };
            default: // technical
                return new String[][]{
                    {"Explain key design principles in " + techName + " for a " + roleName + " at " + levelName + " level.", "Design principles for " + techName + " include SOLID principles, separation of concerns, DRY (Don't Repeat Yourself), and KISS. Apply appropriate patterns like Factory, Observer, or Strategy based on use case."},
                    {"What are the most important " + techName + " performance optimization techniques?", "Key optimizations: connection pooling, caching frequently accessed data, avoiding N+1 query problems with eager/lazy loading, profiling with APM tools, and using async processing for I/O-bound tasks."},
                    {"How do you ensure security in " + techName + " applications?", "Security checklist: input validation, parameterized queries, JWT/OAuth2 authentication, role-based authorization, HTTPS enforcement, secret management (Vault/env), and regular dependency vulnerability scanning."},
                    {"What is your approach to testing " + techName + " applications?", "Testing pyramid: unit tests (mocking dependencies), integration tests (database/API level), and end-to-end tests. Aim for >80% code coverage, use TDD where appropriate."},
                    {"How do you handle error and exception management in " + techName + "?", "Implement global exception handlers, use structured logging (with correlation IDs), return standard error response DTOs, and set up alerts for production error thresholds."}
                };
        }
    }
}

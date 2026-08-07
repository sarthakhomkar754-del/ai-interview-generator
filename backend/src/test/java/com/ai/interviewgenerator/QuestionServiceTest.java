package com.ai.interviewgenerator;

import com.ai.interviewgenerator.dto.GenerateQuestionRequest;
import com.ai.interviewgenerator.dto.QuestionDTO;
import com.ai.interviewgenerator.entity.*;
import com.ai.interviewgenerator.repository.*;
import com.ai.interviewgenerator.service.QuestionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuestionServiceTest {

    @Mock
    private QuestionRepository questionRepository;
    @Mock
    private TechnologyRepository technologyRepository;
    @Mock
    private JobRoleRepository jobRoleRepository;
    @Mock
    private ExperienceLevelRepository experienceLevelRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private DifficultyRepository difficultyRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private FavoriteQuestionRepository favoriteQuestionRepository;
    @Mock
    private GeneratedHistoryRepository generatedHistoryRepository;

    @InjectMocks
    private QuestionServiceImpl questionService;

    private User sampleUser;
    private Technology javaTech;
    private JobRole devRole;
    private ExperienceLevel fresherLevel;
    private Category techCategory;
    private Difficulty mediumDifficulty;
    private Question sampleQuestion;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder().id(1L).email("user@interview.com").role("ROLE_USER").name("John Doe").build();
        javaTech = Technology.builder().id(1L).technologyName("Java").build();
        devRole = JobRole.builder().id(1L).roleName("Java Developer").build();
        fresherLevel = ExperienceLevel.builder().id(1L).levelName("Fresher").build();
        techCategory = Category.builder().id(1L).categoryName("Technical").build();
        mediumDifficulty = Difficulty.builder().id(1L).difficultyName("Medium").build();

        sampleQuestion = Question.builder()
                .id(100L)
                .question("What is JVM?")
                .answer("JVM is Java Virtual Machine which executes bytecode.")
                .technology(javaTech)
                .jobRole(devRole)
                .experienceLevel(fresherLevel)
                .category(techCategory)
                .difficulty(mediumDifficulty)
                .build();
    }

    @Test
    void testGenerateQuestions_Success() {
        GenerateQuestionRequest request = new GenerateQuestionRequest();
        request.setTechnologyId(1L);
        request.setJobRoleId(1L);
        request.setExperienceLevelId(1L);
        request.setCount(1);

        when(userRepository.findByEmail("user@interview.com")).thenReturn(Optional.of(sampleUser));
        when(technologyRepository.findById(1L)).thenReturn(Optional.of(javaTech));
        when(jobRoleRepository.findById(1L)).thenReturn(Optional.of(devRole));
        when(experienceLevelRepository.findById(1L)).thenReturn(Optional.of(fresherLevel));
        when(questionRepository.filterQuestions(1L, 1L, 1L, null, null, null))
                .thenReturn(new ArrayList<>(Collections.singletonList(sampleQuestion)));

        List<QuestionDTO> result = questionService.generateQuestions("user@interview.com", request);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("What is JVM?", result.get(0).getQuestion());
        verify(generatedHistoryRepository, times(1)).save(any());
    }

    @Test
    void testFilterQuestions_ReturnsMatchingDTOs() {
        when(questionRepository.filterQuestions(1L, null, null, null, null, "JVM"))
                .thenReturn(Collections.singletonList(sampleQuestion));

        List<QuestionDTO> result = questionService.filterQuestions(1L, null, null, null, null, "JVM", null);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Java", result.get(0).getTechnologyName());
    }
}

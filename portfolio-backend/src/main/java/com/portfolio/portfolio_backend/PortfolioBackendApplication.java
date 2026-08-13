package com.portfolio.portfolio_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

@SpringBootApplication
@RestController
public class PortfolioBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PortfolioBackendApplication.class, args);
    }

    // चैटबोट का लॉजिक (आपके प्रोजेक्ट्स और स्किल्स के साथ)
    @GetMapping("/api/chat")
    public String chat(@RequestParam String message) {
        String msg = message.toLowerCase();
        if (msg.contains("skills") || msg.contains("tech")) {
            return "My technical skills include Java, Spring Boot, SQL, Python, JavaScript, and AI tools like GitHub Copilot and Cursor.";
        } else if (msg.contains("projects") || msg.contains("work")) {
            return "I have built 3 main projects: 1. Employee Leave Management System, 2. Netflix Clone AI, and 3. Resume Optimizer.";
        } else if (msg.contains("leave") || msg.contains("employee")) {
            return "Employee Leave Management System helps manage employee leave requests and tracking efficiently.";
        } else if (msg.contains("netflix") || msg.contains("clone")) {
            return "Netflix Clone AI is a modern streaming interface clone integrated with AI features.";
        } else if (msg.contains("resume") || msg.contains("optimizer")) {
            return "Resume Optimizer is a tool designed to analyze and enhance resumes for better ATS compatibility.";
        } else {
            return "I am Sachin's AI assistant. Ask me about his skills, education, or projects like Leave Management, Netflix Clone, or Resume Optimizer!";
        }
    }

    // प्रोजेक्ट्स की लिस्ट भेजने के लिए नया API
    @GetMapping("/api/projects")
    public List<Project> getProjects() {
        return Arrays.asList(
            new Project("Employee Leave Management System", "A system to manage employee leave requests and tracking.", "https://github.com/Sachinmandal23/Employee-Leave-Management-System.git"),
            new Project("Netflix Clone AI", "A modern streaming interface clone integrated with AI features.", "https://github.com/Sachinmandal23/Netflix-Clone-AI-main..git"),
            new Project("Resume Optimizer", "A tool designed to analyze and enhance resumes for ATS compatibility.", "https://github.com/Sachinmandal23/Resume_Optimizer.git")
        );
    }

    // Project DTO Class
    public static class Project {
        private String title;
        private String description;
        private String githubUrl;

        public Project(String title, String description, String githubUrl) {
            this.title = title;
            this.description = description;
            this.githubUrl = githubUrl;
        }

        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public String getGithubUrl() { return githubUrl; }
    }

    // CORS इनेबल करना (सभी के लिए ओपन)
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
            }
        };
    }

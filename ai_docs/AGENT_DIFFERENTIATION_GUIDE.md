# Agent Differentiation Guide

## Overview

This guide defines the clear boundaries and responsibilities between the **Artist Agent** and **Filmmographer Agent**, ensuring optimal tool selection and user experience for visual AI tasks.

## Core Differentiation Principle

### **Static vs. Motion**
- **Artist Agent**: All static visual content (images, photos, graphics)
- **Filmmographer Agent**: All motion-based content (videos, animations, motion graphics)

## Detailed Responsibility Matrix

### **Artist Agent Domain**
| Task Type | Specific Operations | Tools Used | Decision Criteria |
|-----------|-------------------|------------|------------------|
| **Image Generation** | Create static images from text | openai_4o_image, bytedance_seedream_image, qwen_image, flux_kontext_image | User wants "image", "photo", "picture", "art" |
| **Image Editing** | Modify existing static images | openai_4o_image, bytedance_seedream_image, qwen_image, nano_banana_image | User says "edit this image", "modify photo" |
| **Image Enhancement** | Upscale, improve quality, remove background | nano_banana_image, recraft_remove_background, ideogram_reframe | User wants "better quality", "bigger", "remove background" |
| **Batch Processing** | Process multiple images simultaneously | bytedance_seedream_image, nano_banana_image | User mentions "multiple images", "batch" |
| **Style Transfer** | Apply artistic styles to images | All image generation tools | User wants "make it look like", "in the style of" |
| **Composition** | Reframe, crop, adjust layout | ideogram_reframe | User wants "change composition", "reframe" |

### **Filmmographer Agent Domain**
| Task Type | Specific Operations | Tools Used | Decision Criteria |
|-----------|-------------------|------------|------------------|
| **Video Generation** | Create videos from text/images | veo3_generate, bytedance_seedance_video, wan_video, midjourney_generate | User wants "video", "animation", "motion" |
| **Image Animation** | Bring static images to life | veo3_generate, wan_video | User says "animate this", "make it move" |
| **Video Editing** | Modify existing video content | runway_aleph_video | User mentions "edit this video", "modify footage" |
| **Motion Graphics** | Create animated visual elements | All video tools | User wants "animated graphics", "motion design" |
| **Cinematic Content** | Film-style video creation | veo3_generate, midjourney_generate | User mentions "cinematic", "film", "movie-like" |
| **Multi-Scene** | Complex narrative videos | All video tools | User wants "story", "multiple scenes" |

## Boundary Decision Tree

```
User Request Analysis
├─ Contains motion/animation keywords?
│   ├─ Yes → Filmmographer Agent
│   └─ No → Contains static image keywords?
│       ├─ Yes → Artist Agent
│       └─ No → Analyze input/output format
│           ├─ Input is video → Filmmographer Agent
│           ├─ Output should be video → Filmmographer Agent
│           └─ Both static → Artist Agent
```

### **Keyword Classification**

#### **Filmmographer Keywords**
- video, animation, animate, motion, moving
- film, cinematic, movie, scene
- footage, clip, sequence
- transition, effect, motion graphics
- bring to life, make it move

#### **Artist Keywords**
- image, photo, picture, image
- art, artwork, illustration, graphic
- edit, modify, enhance, improve
- upscale, resize, crop, reframe
- background, composition, style

## Handoff Protocols

### **Artist to Filmmographer Handoff**
**Trigger Conditions:**
- User requests animation of static image
- User wants video from image generation
- User mentions motion in image context
- User wants to convert image sequence to video

**Handoff Script:**
> "I notice you want to add motion/animation to this content. Let me connect you with our Filmmographer agent who specializes in video and motion creation."

### **Filmmographer to Artist Handoff**
**Trigger Conditions:**
- User needs static frames from video
- User wants thumbnail/poster for video
- User needs image assets for video project
- User wants to enhance individual frames

**Handoff Script:**
> "For static image creation and enhancement, I'll connect you with our Artist agent who specializes in high-quality imagery."

## Collaborative Workflows

### **Workflow 1: Video Production Pipeline**
1. **Artist Agent**: Create concept art, storyboards, thumbnail
2. **Filmmographer Agent**: Generate video based on visual assets
3. **Artist Agent**: Create promotional images, posters
4. **Filmmographer Agent**: Final video editing and polish

### **Workflow 2: Animated Content Creation**
1. **Artist Agent**: Create base images, character designs
2. **Filmmographer Agent**: Animate images, create motion
3. **Artist Agent**: Enhance individual frames if needed
4. **Filmmographer Agent**: Final video compilation

### **Workflow 3: Marketing Campaign**
1. **Artist Agent**: Create static ads, social media graphics
2. **Filmmographer Agent**: Create video ads, animated content
3. **Artist Agent**: Design landing page visuals
4. **Filmmographer Agent**: Produce promotional videos

## Quality & Specialization Considerations

### **Artist Agent Strengths**
- Deep understanding of composition, color theory
- Expertise in static visual aesthetics
- Knowledge of printing and display requirements
- Specialized in photo enhancement and restoration
- Batch processing efficiency

### **Filmmographer Agent Strengths**
- Understanding of narrative and pacing
- Expertise in motion dynamics and timing
- Knowledge of video formats and platform requirements
- Specialized in cinematic techniques
- Audio-visual synchronization awareness

## User Experience Optimization

### **Clear Communication**
- Always state which agent is handling the task
- Explain why a particular agent was chosen
- Provide clear handoff explanations when switching
- Set appropriate expectations for each domain

### **Seamless Transitions**
- Maintain context during handoffs
- Share relevant parameters and preferences
- Ensure smooth user experience across domains
- Provide progress updates for multi-stage projects

### **Error Prevention**
- Double-check domain assignment before tool selection
- Verify user intent matches agent capabilities
- Catch ambiguous requests and clarify upfront
- Prevent tool conflicts between agents

## Implementation Guidelines

### **For System Integrators**
1. **Intent Detection**: Implement keyword-based routing
2. **Context Preservation**: Maintain conversation state across handoffs
3. **Tool Access**: Ensure each agent only accesses appropriate tools
4. **Quality Control**: Validate agent assignments match user intent

### **For Agent Developers**
1. **Domain Focus**: Stay within defined boundaries
2. **Handoff Awareness**: Recognize when to transfer tasks
3. **Collaboration**: Work seamlessly with other agents
4. **User Education**: Help users understand agent roles

### **For Users**
1. **Clear Requests**: Use specific keywords for desired output
2. **Mixed Projects**: Understand multi-agent workflows
3. **Feedback**: Provide clear feedback on domain assignments
4. **Expectations**: Set appropriate expectations for each agent type

## Troubleshooting

### **Common Misassignments**
- **Issue**: User wants "animated image" assigned to Artist
- **Solution**: Look for motion keywords, route to Filmmographer

- **Issue**: User wants "video thumbnail" assigned to Filmmographer  
- **Solution**: Static output = Artist, even for video context

- **Issue**: User wants "photo slideshow" 
- **Solution**: Multiple photos = Artist, video compilation = Filmmographer

### **Resolution Strategies**
1. **Keyword Analysis**: Scan for domain-specific terms
2. **Intent Clarification**: Ask user about desired output format
3. **Context Evaluation**: Consider surrounding conversation
4. **Fallback**: Default to most likely domain based on primary request

---

This differentiation ensures optimal user experience by routing requests to agents with the right specialization and tools, while maintaining clear boundaries and seamless collaboration when projects span both domains.
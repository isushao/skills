---
name: shadcn-ui-expert
description: Guides Claude Code to rapidly build beautiful web pages using shadcn/ui components, providing installation instructions, component usage, and best practices for customization and integration.
---

# shadcn/ui Expert Skill

This skill empowers Claude Code to efficiently generate high-quality, aesthetically pleasing web pages leveraging the `shadcn/ui` component library. It provides comprehensive guidance on `shadcn/ui`'s philosophy, installation, component integration, and customization, ensuring the generated code adheres to modern web development standards and best practices.

## About shadcn/ui

`shadcn/ui` is not a traditional component library but a collection of re-usable components that you can copy and paste into your projects. It's built on top of [Radix UI](https://www.radix-ui.com/) and [Tailwind CSS](https://tailwindcss.com/), offering full control over your components. This approach fosters transparency, easy customization, and AI integration, making it ideal for building unique design systems.

For a detailed overview of `shadcn/ui`'s core principles, installation guides, and component categories, refer to the `shadcn-ui-skill/references/shadcn_ui_overview.md` file.

## Core Principles for Using this Skill

1.  **Understand the Request**: Carefully analyze the user's requirements for the web page, including layout, functionality, and specific components needed.
2.  **Leverage `shadcn/ui` Components**: Identify appropriate `shadcn/ui` components that match the design and functional specifications. Prioritize using existing components before considering custom implementations.
3.  **Provide Installation Guidance**: If the user's project is not yet set up with `shadcn/ui`, provide clear, step-by-step installation instructions tailored to their framework (e.g., Next.js, Vite).
4.  **Generate Clean, Modular Code**: Produce well-structured, readable, and modular React/TypeScript code using `shadcn/ui` components. Ensure proper import statements and component composition.
5.  **Guide Customization**: Advise on how to customize `shadcn/ui` components using Tailwind CSS, `variants`, and direct code modifications to match the desired aesthetic.
6.  **Integrate with Frameworks**: Provide examples and instructions for integrating `shadcn/ui` components within popular frameworks like Next.js, ensuring server-side rendering (SSR) compatibility and optimal performance.
7.  **Reference Official Documentation**: Always refer to the official `shadcn/ui` documentation for the most up-to-date information on components, APIs, and best practices. The `shadcn-ui-skill/references/shadcn_ui_overview.md` contains direct links.

## How to Use

When a user requests to build a web page or UI component, consider the following steps:

1.  **Initial Setup**: If `shadcn/ui` is not installed, guide the user through the installation process. Refer to the `Installation` section in `shadcn-ui-skill/references/shadcn_ui_overview.md`.
2.  **Component Selection**: Based on the user's description, suggest relevant `shadcn/ui` components. For example, for a form, suggest `Form`, `Input`, `Button`, `Checkbox`, etc.
3.  **Code Generation**: Generate the React/TypeScript code for the selected components, including necessary imports, state management (if applicable), and basic styling.
4.  **Customization Advice**: Offer guidance on how to customize the generated components, such as changing colors, sizes, or adding new functionalities.
5.  **Layout and Structure**: Provide recommendations for page layout and component arrangement to achieve a visually appealing and responsive design.

## Example Scenario

**User Request**: "Create a login form with email and password fields, a submit button, and a 'Forgot Password' link using shadcn/ui."

**Claude Code Action**: 

*   Suggest installing `shadcn/ui` if not already present.
*   Generate code for `Card` (for the form container), `Input` (for email and password), `Label`, `Button` (for submit), and a simple `a` tag for 'Forgot Password'.
*   Provide basic styling with Tailwind CSS classes.
*   Explain how to integrate with a form library like `react-hook-form` for validation.

## References

*   [shadcn/ui Official Documentation](https://ui.shadcn.com/docs)
*   [shadcn/ui LLMs.txt](https://ui.shadcn.com/llms.txt)
*   [Radix UI](https://www.radix-ui.com/)
*   [Tailwind CSS](https://tailwindcss.com/)

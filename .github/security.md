# Security Policy

Thanks for helping keep Koobiq and its users safe.

## Supported versions

Security fixes are made on `main`, which is the current release line (`3.x`).

## Reporting a vulnerability

**Please do not report security vulnerabilities through public issues, discussions, or pull
requests.**

Report privately through GitHub instead: open the
[Security tab](https://github.com/koobiq/date-formatters/security) of this repository and use
**Report a vulnerability**. The report is visible only to the maintainers, and it gives us a
private place to discuss and prepare a fix with you.

To help us triage quickly, please include as much of the following as you can:

-   the type of issue (for example prototype pollution, denial of service through a crafted
    locale or format string, or a supply chain problem);
-   the affected package and version, and the source files involved;
-   the configuration needed to reproduce the issue;
-   step-by-step reproduction instructions, ideally a minimal example;
-   proof-of-concept or exploit code, if you have it;
-   the impact, and how an attacker might use it.

## What happens next

We will acknowledge the report, keep you updated as we investigate, and credit you in the
advisory when the fix is published, unless you would rather stay anonymous. We ask that you give
us a chance to release a fix before disclosing the issue publicly.

## Dependency vulnerabilities

Advisories against dependencies are tracked by Dependabot in this repository.

The published packages declare their date libraries (`luxon`, `moment`,
`@internationalized/date`, `@messageformat/core`) as peer dependencies, so a consumer controls
which version is installed. Vulnerabilities in those libraries should be reported to their
respective projects.

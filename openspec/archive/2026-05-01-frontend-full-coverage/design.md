# Design: Testing Strategy for 100% Coverage

## Mocking Strategy

### 1. Axios (Global Mock)
We will use `vi.mock('axios')` to control all API responses.
- Success scenario: `axios.get.mockResolvedValue({ data: [...] })`.
- Error scenario: `axios.post.mockRejectedValue({ response: { status: 500 } })`.

### 2. Assets (Image Mocks)
Since we have CSS/Images, we need to ensure they don't break the tests (handled by Vitest config, but we'll be careful with path imports).

### 3. Component Isolation
We will test components in isolation when possible, but use `render` from RTL to simulate the full DOM tree of each component.

## File Mapping
- `Sidebar.test.jsx`: Test navigation links and responsive toggle.
- `Ouvidoria.test.jsx`: Test form submission and validation.
- `FeedNoticias.test.jsx`: Test fetching and displaying news.
- `Vagas.test.jsx`: Test fetching and displaying jobs.
- `Acervo.test.jsx`: Test document list.
- `Admin.test.jsx`: Test login form and authenticated state.

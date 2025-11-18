# DAHLIA Partners

A portal for leasing agents, sales agents, and developers to manage listings and applications.

[![Maintainability](https://api.codeclimate.com/v1/badges/9e8566f1a7a92c4eca3e/maintainability)](https://codeclimate.com/github/SFDigitalServices/sf-dahlia-lap/maintainability)
[![QLTY Maintainability](https://qlty.sh/badges/3497c285-f114-41d4-aba0-f04ba7425a9c/maintainability.svg)](https://qlty.sh/gh/SFDigitalServices/projects/sf-dahlia-lap)

Only showing rspec tests for now:
[![Test Coverage](https://api.codeclimate.com/v1/badges/9e8566f1a7a92c4eca3e/test_coverage)](https://codeclimate.com/github/SFDigitalServices/sf-dahlia-lap/test_coverage)
[![QLTY Code Coverage](https://qlty.sh/badges/3497c285-f114-41d4-aba0-f04ba7425a9c/test_coverage.svg)](https://qlty.sh/gh/SFDigitalServices/projects/sf-dahlia-lap)

Cross-browser testing done with <a href="https://www.browserstack.com/"><img src="./Browserstack-logo@2x.png?raw=true" height="36" ></a>

## Setup

- Use Ruby 3.4.1 (Set the version using [RVM](https://rvm.io/rvm/install) or [rbenv](https://github.com/rbenv/rbenv))
- Install [Bundler](https://github.com/bundler/bundler) `gem install bundler`
- Use Node v22.12.x (npm v10.9.0)
- Install Yarn (if you have Homebrew you can run `brew install yarn`)
- Run `yarn install`
- Run `bundle install`
  - see [here](https://stackoverflow.com/a/19850273/260495) if you have issues installing `pg` gem with Postgres.app, you may need to use: `gem install pg -v 0.21.0 -- --with-pg-config=/Applications/Postgres.app/Contents/Versions/latest/bin/pg_config`
  - if you need to run this command make sure you run `bundle install` again following the success of the postgres installation to install the remaining gems

* Run `overcommit --install`
* Create a `.env` file in the root directory and ask a team member for access to the local development secrets
* Setup your local database by running `bin/rails db:migrate RAILS_ENV=development`

### VSCode setup

We recommend you use VSCode to develop partners. You can use something else, but you're on your own for setting up linting/autocomplete.

#### Installing recommended VSCode extensions

Open the partners projects in VSCode, click the extensions tab and filter by recommended extensions, install the extensions under "Workspace recommendations"

#### Configuring VSCode and extensions

Necessary configs are defined in [.vscode/settings.json](.vscode/settings.json). you can override those configs or change additional settings by changing the apps user settings (Code -> Preferences -> Settings or using the shortcut `CMD + ,`)

## To run server and client concurrently

- `yarn start`
- Access the app at [http://localhost:3000/](http://localhost:3000/)

## To update CSS from Pattern Library

- Checkout your desired commit in your local copy of the [sf-dahlia-pattern-library](https://github.com/SFDigitalServices/sf-dahlia-pattern-library)
- Run `npm start` in your pattern lib directory
- In a separate tab, change to the partners directory and run `grunt`

## Icons

The icons are from sf-dahlia-pattern-library](https://github.com/SFDigitalServices/sf-dahlia-pattern-library).
Instructions for how to add icons is documented there. It is copied/pasted below for convenience.

We use icons from icomoon.io. To add new icons:

1. Go to https://icomoon.io/app/
1. Click "import icons" and upload the current [selections.json](https://github.com/SFDigitalServices/sf-dahlia-pattern-library/blob/main/public/toolkit/icons/icomoon/selection.json)
1. Select any new icons you want to add
1. Click "Generate SVG and more" on the bottom bar, then click download using the default settings
1. Replace the current [icomoon folder](https://github.com/SFDigitalServices/sf-dahlia-pattern-library/tree/main/public/toolkit/icons/icomoon) with the unzipped folder you just downloaded
1. Copy and paste the new symbols from [demo.html](https://github.com/SFDigitalServices/sf-dahlia-pattern-library/blob/main/public/toolkit/icons/icomoon/demo.html) into [\_icons.html](https://github.com/SFDigitalServices/sf-dahlia-pattern-library/blob/main/components/_icons.html)

To use the new icons in Partners, replace the [layouts/\_icons.html](https://github.com/SFDigitalServices/sf-dahlia-lap/blob/main/app/views/layouts/_icons.html) file with the content of [\_icons.html](https://github.com/SFDigitalServices/sf-dahlia-pattern-library/blob/main/components/_icons.html)

## Linting

To lint Ruby code run: `rubocop`

To lint the React code run: `yarn lint`

To fix any auto-fixable linting errors run: `yarn lint:fix`

## Visual Studio setup

Install the following extensions:

- [EsLint](https://github.com/Microsoft/vscode-eslint)
- [Prettier](https://github.com/prettier/prettier-vscode)

To automatically fix linting errors on save, add this to your VSCode workspace settings:

```
"editor.codeActionsOnSave": {
    // For ESLint
    "source.fixAll.eslint": true,
},
```

## Rails tests

### Running tests

`bundle exec rake spec`

**Updating VCR Cassettes**

If the Salesforce API changes for a request, or if the data sent to the API for a request has changed, you have to update the VCR cassettes affected. Cassettes are YAML files located in the `spec/vcr/` directory.

In order to update the cassettes you have to:

- Go to your failing test.
- Locate the instruction that is creating the cassette with `VCR.use_cassette`.
- Remove the cassette specified from `spec/vcr/`

For example, for:

```
VCR.use_cassette('listings/applications_controller/index') do
```

You have to remove:

```
spec/vcr/listings/applications_controller/index.yml
```

Then re-run your test. **Be aware that now that request in your test will actually be run.** A new cassette will be automatically generated recording that new run of the request, and then subsequent runs of the test will use that recorded cassette for the request.

## React/Javascript tests

### Running unit tests

`yarn unit`

**Updating snapshots**

If you made a legitimate change in the view and a snapshot fails then you have to tell Jest to update the snapshots. Run:

`yarn unit -u`

_Note: Snapshots should be pushed to the repo_

### Running e2e tests

To run the E2E tests in a headless state, run `yarn e2e`

If you want to use the Cypress UI to view the tests, you can run `yarn e2e:open`

_Note: The app should also be running (using `yarn start`) in another terminal when you run the e2e tests_

#### Run server and client concurrently (in a terminal window)

`yarn start`

#### Run tests (in another terminal window)

`yarn e2e`

### Running all or individual tests

To run all tests (unit and e2e):

`yarn test:all`

To run an individual test:

`yarn test:all path/to/test`

### Qlty

[Qlty](https://qlty.sh) was spun out of Code Climate to focus on code quality checks.
Qlty provides a cli to run checks locally.

- Install the CLI: `curl https://qlty.sh | sh`
- [CLI Quickstart](https://docs.qlty.sh/cli/quickstart)

### Writing unit tests with React Testing Library

#### General best practices

[React Testing Library (RTL)](https://testing-library.com/docs/queries/about) is a library for testing React components in a way that resembles how your app's users would interact with your app. Instead of dealing with instances of rendered React components, your tests will work with actual DOM nodes rendered in a headless version of Chromium

RTL encourages you to interact with your components in the same way a user would, rather than testing implementation details like props being passed, internal state, or styling. This means RTL tests tend to be more resilient to changes in your app's code and can catch a wider range of bugs.

1. Interact with your components like a user: Use RTL's fireEvent (or userEvent) functions to simulate user interactions like clicking buttons, typing into inputs, and submitting forms. Avoid interacting with your components in ways a user couldn't, like by setting props or state directly.

2. Query by specific accessible roles and labels: Use RTL's getByRole, getByLabelText, and other similar functions to select elements in your tests. These functions select elements based on their accessible roles and labels, which is how users find and interact with elements. Avoid selecting elements by their tag name, class name, or other implementation details.
   - When trying to query for something, try to be as specific as possible. A button, for example can be queried with `screen.getByRole('button)`, but you could also be more specific and say `screen.getByRole('button, {name: 'click me'})`
   - `getBy*` and `queryBy*` operate slightly differently, the former will throw an error is nothing is found, while the latter will simply return undefined if no elements are found. If you are querying for something that you know isn't there, then use `expect(screen.queryBy*(element)).not.toBeInTheDocument()`
   - `[get|query]AllBy*` and `[get|query]By*` are also different, with the former returning an array and the other returning only one (and throwing an error if it finds otherwise).

3. Snapshots are a great way to mass verify that a component is being rendered correctly. However, they should be used sparingly because they are both brittle and not a great way to detect something breaking.
4. Tests should not be overly complex.
   - If you feel like a test is testing too many different things, or that your test is trying to run a user flow, consider making it an E2E test.
   - Don't double test something. For example, if a component uses a button that is itself being tested independently, then there is no need to test it in another component, unless the button is being used in a novel way

#### Debugging

Some things to consider when debugging:

- Are you missing a context provider that you can mock using jest?
- Should an action or assertion be wrapped in `act`?
- Are you using getBy when you should be using queryBy?
- Is the test inheriting something from a beforeEach or from a parent test?

The `screen` constant provides a lot of good debugging tools:

- `screen.logTestingPlaygroundURL` will output a url that has encoded everything the test was looking at. Copy the url and past it into the browser to see what the test was looking at rendered (without styling). The tool will also help you to find the most effective selector.
- `screen.debug([component])` will render the component in the terminal in a much more pretty way than console.log will.
- If you are having issues with only one test in a large testing suite, use `test.only(...)` to only run that single test. The inverse is also true, where using `test.skip(...)` will skip that specific test

## Scripts

### Release scripts

More documentation for how these scripts are used during a release in the [partners release process doc](https://sfgovdt.jira.com/wiki/spaces/HOUS/pages/1900544029/Partners+Release+processes+template).

#### 1. create_release_branch

Command: `yarn create_release_branch`

This script will:

- Create a new branch named `release-<todays-date>`
- Merge it with the latest main
- Open a PR in a browser window

#### 2. print_release_info

Command: `yarn print_release_info -u <github-username> -t <github-access-token>`

Instructions for how to get your github access token are printed by running `yarn print_release_info -h`

This script will:

- Print release tracker info you can paste into the [Release Tracker doc](https://docs.google.com/spreadsheets/d/1EUvw2ugaFprt8FxlCUa1yWATSn0KKo4FyRfBJWUwE3M/edit#gid=1500049656)
- Output a URL that will create a draft release with description, title, tags, and base branch filled in

## Debugging

You can debug all tests and Rails server in VS code.
Go to debug view (⇧+⌘+D on Mac)
From the dropdown in left top corner pick what you want to debug:

- Rails server: for running app
- Jest: for any javascript test
- Rspec: for ruby tests

For tests you can debug a single file or the whole suite. To enter debug click a breakpoint (red dot) left side to line number of the file you want to debug and run the test with play button. In the debug console you can run any function to check the expected outcome. Also adding watch expressions is very helpful. You can use the bar that popups to jump to next lines of code, into the functions or continue.

### Debugging Javascript

To debug javascript, run Rails server in the prefered way. Go to browser and open inspector (⌥+⌘+I). Go to Sources tab and press ⌘+P to search for a file that you want to debug eg. PaperApplicationForm. Click line number to set a breakpoint in the place you want to debug. You can also add watch expressions, step into or over lines like in VS code debugger.

## React Hooks

Wanted to post a basic intro to react hooks here as they will make our code more performant and allow us to use more functional components. I have examples below but you can read more on the [React Documentation](https://reactjs.org/docs/hooks-overview.html)

### useState, useEffect, and useRef Hooks

These hooks are all built-in to react by default.

`useState` allows functional components to manage state just like a class component but with a streamlined syntax.

```js
// class version
class Dropdown extends React.Component {
  state = {
    expanded: false
  }

  expandDropdown = () => {
    this.setState({ expanded: true })
  }
}

// hooks version
const Dropdown = () => {
  const [expanded, setExpanded] = useState(false)

  const expandDropdown = () => {
    setExpanded(true)
  }
}
```

These components now have the exact same level of control over the expanded flag but the below function has less overhead when mounting and unmounting.

`useEffect` is the hook that allows us to still take advantage of lifecycle events when necessary.

```js
const Dropdown = ({ styles }) => {
  // The empty array passed as the second param here
  // allows for this function to only fire once on
  // mount. This is the hooks version of componentDidMount
  useEffect(() => {
    loadData()
  }, [])
  // The prop passed in the array as the second param here
  // allows for this function to fire once on
  // mount and then anytime that prop changes. You can
  // add more than one prop to a given effect and it will
  // fire when any of those props changes. This is the hooks
  // version of componentDidUpdate
  useEffect(() => {
    updateStyles()
  }, [styles])
}
```

`useRef` allows us access to the `ref` prop of any tag in a component just like a normal ref is assigned. The syntax for the hook is simpler than the old way.

```js
// old version
wrapperRef = null
render() {
  return (
    <div ref={(node) => this.wrapperRef = node }>
      // other stuff
    </div>
  )
}

// hooks version
const wrapperRef = useRef(null)
return (
  <div ref={wrapperRef}>
    // other stuff
  </div>
)
```

import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import file from './pages/docker-compose.md';
import htmlParser from 'react-markdown/plugins/html-parser'

import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super();
    this.state = {
      markdownSrc: "# Hello World"
    }
  }

  parseHtml = htmlParser({
    isValidNode: node => node.type !== 'script',
    processingInstructions: [/* ... */]
  })

  componentWillMount() {
    fetch(file).then((response) => response.text()).then((text) => {
      this.setState({ markdownSrc: text })
    })
  }

  renders() {

    return {
      root: ({ children }) => {
        console.log(children);
        // TABLE OF CONTENT
        const TOCLines = children.reduce((acc, { key, props }) => {
          // Skip non-headings
          if (key.indexOf('heading') !== 0) {
            return acc;
          }

          // Indent by two spaces per heading level after h1
          let indent = '';
          for (let idx = 1; idx < props.level; idx++) {
            indent = `${indent}  `;
          }

          // Append line to TOC
          // This is where you'd add a link using Markdown syntax if you wanted
          return acc.concat([`${indent}* ${props.children[0].props.value}`]);
        }, []);

        const array = [];
        let current;
        children.forEach(element => {
          if (element.key.indexOf('heading') === 0) {
            current = [];
            array.push(current);
          }
          current.push(element);
        });
        console.log(array);
        return (
          <div>
            <ReactMarkdown source={TOCLines.join("\n")} />
            {array.map(children => {
              return <div>
                {children}
              </div>;
            })}
          </div>
        );
      }
    };

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <ReactMarkdown className="result" source={this.state.markdownSrc} renderers={this.renders()} />
        </header>
      </div>
    );
  }
}

export default App;

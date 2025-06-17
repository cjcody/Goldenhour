import React from 'react';

const TypographyDemo = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Typography Examples</h2>
      <article className="prose lg:prose-xl">
        <h1>Heading 1</h1>
        <p>
          This is a paragraph demonstrating the typography plugin. It includes proper spacing and styling for long-form content.
        </p>
        <h2>Heading 2</h2>
        <p>
          Another paragraph with some <strong>bold text</strong> and <em>italic text</em>. The typography plugin ensures consistent styling across different elements.
        </p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
          <li>List item 3</li>
        </ul>
        <blockquote>
          This is a blockquote that demonstrates the typography plugin's styling capabilities.
        </blockquote>
      </article>
    </section>
  );
};

export default TypographyDemo; 
---
type: writing
title: "(Don't Update) All the Small Things"
description: React gets simpler when you stop updating every value that changes and derive lists, counts, and other values from one source of truth.
pubDate: 2026-07-21
image:
  src: /writing/dont-update-all-the-small-things.png
  alt: Three fictional programmers pose in a grayscale punk collage labeled Don't Update and All the Small Things.
category: Technology
tags:
  - react
  - state management
  - programming
  - frontend
featured: false
---

I've been seeing people struggle with reactive coding a lot lately and I totally
get it. It feels completely backwards. Here are a few pointers to help you get
started with thinking in the React way. They're not necessarily going to make
you fall in love with it, but they might help you practice habits that will be
helpful in the long run.

First, think about this:

```ts
const someArray = [1];
console.log(someArray.length); // 1
someArray.push(2);
console.log(someArray.length); // 2
```

You wouldn't have wanted to manually set `someArray.length`. Instead, you expect
it to be managed automatically for you. That's a start in the reactive vein of
thinking. And yet I keep seeing the manual approach.

Here's a silly packing list that shows the imperative thinking I keep running
into. Suppose you want to track which items are packed and show the packed and
unpacked counts.

```jsx
function MyComponent() {
  const [items, setItems] = useState(…);
  const [packedCount, setPackedCount] = useState(0);
  const [notPackedCount, setNotPackedCount] = useState(items.length);

  const onToggleItem = item => {
    // Toggle the packed state
    item.isPacked = !item.isPacked;
    // Update the state
    setItems(old => old.map(other => other === item ? item : other));
    // Update the counters
    if (item.isPacked) {
      setPackedCount(packedCount + 1);
      setNotPackedCount(notPackedCount - 1);
    } else {
      setPackedCount(packedCount - 1);
      setNotPackedCount(notPackedCount + 1);
    }
  };
}
```

UGH! This is so very imperative. All these things could've been tracked for you.
Instead of directly managing the counters, you can derive them from state. When
complaining about this to a developer, I saw them "fix it" this way:

```jsx
  const [packedItems, setPackedItems] = useState(…);
  const [notPackedItems, setNotPackedItems] = useState(…);
  const packedCount = packedItems.length;
  const notPackedCount = notPackedItems.length;

  const onToggleItem = item => {
    const toggledItem = {...item, isPacked: !item.isPacked};

    if (item.isPacked) {
      setPackedItems(old => old.filter(other => other.id !== item.id));
      setNotPackedItems(old => old.concat(toggledItem));
    } else {
      setNotPackedItems(old => old.filter(other => other.id !== item.id));
      setPackedItems(old => old.concat(toggledItem));
    }
  };
```

Ok. There are some improvements there, but now your list is going to shuffle
order whenever you toggle items between packed and not packed. This is a lot of
complexity that could be managed for you automatically like `array.length`.

```jsx
  const [items, setItems] = useState(…);
  const packedItems = items.filter(item => item.isPacked);
  const notPackedItems = items.filter(item => !item.isPacked);
  const packedCount = packedItems.length;
  const notPackedCount = notPackedItems.length;

  // At this point the update is super trivial
  const onToggleItem = id => {
    setItems(old => old.map(other => {
      if (other.id !== id) return other;
      return {...other, isPacked: !other.isPacked};
    }));
  };
```

Now there's only one thing to update: the item itself. The lists and counts
aren't separate state, so they can't fall out of sync. React renders them from
the current items every time.

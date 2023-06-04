const data = [
  {
    id: 1,
    probId: '1',
    title: 'Card 1',
    type: 'Type 1',
    tag: 'Tag 1',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    totalUpvotes: 10,
    solutions: [
      { id: 1, text: 'Solution 1', totalUpvotes: 5 },
      { id: 2, text: 'Solution 2', totalUpvotes: 3 },
    ],
  },
  {
    id: 2,
    probId: '2',
    title: 'Card 2',
    type: 'Type 2',
    tag: 'Tag 2',
    body: 'Nulla convallis, metus quis blandit venenatis, metus metus congue ligula.',
    totalUpvotes: 5,
    solutions: [
      { id: 1, text: 'Solution 1', totalUpvotes: 2 },
      { id: 2, text: 'Solution 2', totalUpvotes: 1 },
      { id: 3, text: 'Solution 3', totalUpvotes: 0 },
    ],
  },
  {
    id: 3,
    probId: '3',
    title: 'Card 3',
    type: 'Type 1',
    tag: 'Tag 3',
    body: 'Praesent consequat nunc ut orci suscipit, a elementum enim finibus.',
    totalUpvotes: 7,
    solutions: [{ id: 1, text: 'Solution 1', totalUpvotes: 7 }],
  },
  {
    id: 4,
    probId: '4',
    title: 'Card 4',
    type: 'Type 2',
    tag: 'Tag 1',
    body: 'Vestibulum tempus dui nec urna ullamcorper, eu posuere dui maximus.',
    totalUpvotes: 12,
    solutions: [],
  },
  // Add more data objects as needed
];


export function getAllProblems() {
  return data;
}

export function getProblemData(problemId) {
  const problem = data.find((p) => p.probId === problemId);
  return problem;
}

export default function handler(req, res) {
  res.status(200).json(data);
}

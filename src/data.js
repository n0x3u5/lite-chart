const domain = [
  {
    x: 'Jan',
    color: '#267278'
  },
  {
    x: 'Feb',
    color: '#65338D'
  },
  {
    x: 'Mar',
    color: '#4770B3'
  },
  {
    x: 'Apr',
    color: '#D21F57'
  },
  {
    x: 'May',
    color: '#3B3689'
  },
  {
    x: 'Jun',
    color: '#50AED3'
  },
  {
    x: 'Jul',
    y: 0,
    color: '#4BB24F'
  },
  {
    x: 'Aug',
    color: '#E57438'
  },
  {
    x: 'Sep',
    color: '#569DD2'
  },
  {
    x: 'Oct',
    y: 900,
    color: '#569D79'
  },
  {
    x: 'Nov',
    color: '#58595B'
  },
  {
    x: 'Dec',
    color: '#E4B031'
  }
];

export default domain.map(domainElem => ({
  x: domainElem.x,
  y: domainElem.y === undefined ? Math.random() * 900 : domainElem.y,
  color: domainElem.color
}));

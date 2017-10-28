const domain = [
  {
    x: 'Jan',
    color: '#A7CEE2'
  },
  {
    x: 'Feb',
    color: '#2679B2'
  },
  {
    x: 'Mar',
    color: '#B3DE8E'
  },
  {
    x: 'Apr',
    color: '#389F34'
  },
  {
    x: 'May',
    color: '#F99B9B'
  },
  {
    x: 'Jun',
    color: '#E01F27'
  },
  {
    x: 'Jul',
    color: '#FCBE75'
  },
  {
    x: 'Aug',
    color: '#FD7F23'
  },
  {
    x: 'Sep',
    color: '#CAB3D5'
  },
  {
    x: 'Oct',
    color: '#694098'
  },
  {
    x: 'Nov',
    color: '#FFFE9F'
  },
  {
    x: 'Dec',
    color: '#AF592F'
  }
];

export default domain.map(domainElem => ({
  x: domainElem.x,
  y: Math.random() * -20,
  color: domainElem.color
}));

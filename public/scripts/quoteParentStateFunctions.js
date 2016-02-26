function formatThousands(num){
  return num > 999 ? (num/1000).toFixed(1) + 'k' : num
}
function formatDecimal(num){
  return Math.round(num*100)/100;
}
//Pure functions, aka return the same result given the same arugements.
var SymbolRow = function(props){
    return (
      <tr>
        <td>{props.Symbol} {props.symbol.Name}</td>
        <td>{formatDecimal(props.symbol.LastPrice)} </td>
        <td>{formatDecimal(props.symbol.Change)} ({formatDecimal(props.symbol.ChangePercent)})%</td>
        <td>{formatThousands(props.symbol.MarketCap)}</td>
      </tr>
    );
}

var SymbolTable = function(props){
    var rows = [];
    props.symbols.forEach(function(symbol){
      rows.push(<SymbolRow symbol={symbol} key={symbol.Name} />);
    }.bind(this));

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price></th>
            <th>Change</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
}

var FilterableSymbolTable = React.createClass({
  getInitialState: function() {
    return {
      symbols: [],
      newSymbol: '',
      symbolsToSearch: ['MSFT','AAPL','IBM','GOOG','FB','YHOO']
    };
  },
  componentDidMount: function() {
    this.state.symbolsToSearch.forEach(function(symbol){
      this.searchForSymbol(symbol);
    }.bind(this))
  },
  searchForSymbol: function(symbol){
      $.ajax({
        url: "http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp",
        data: {symbol: symbol},
        dataType: 'jsonp',
        cache: false,
        success: function(data) {
          this.setState({
            symbols: this.state.symbols.concat([data])
          });
        }.bind(this)
      });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    //TODO: put into correct format {name: this.state.newSymbol}

    var allItems = this.state.symbolsToSearch.concat([this.state.newSymbol]);
    this.setState({
      symbolsToSearch: allItems
    });

    this.searchForSymbol(this.state.newSymbol);
  },
  refreshSymbols: function(e){
    e.preventDefault();
    this.setState({
      symbols: []
    });
    this.componentDidMount();
  },
  onChange: function(e){
    this.setState({
      newSymbol: e.target.value
    })
  },
  render: function(){
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Search for Symbol.." onChange={this.onChange} value={this.props.newSymbol} />
          <input type="submit" value="Add Symbol" />
        </form>
        <form onSubmit={this.refreshSymbols}>
          <input type="submit" value="Refresh Symbols" />
        </form>
        <SymbolTable symbols={this.state.symbols} />
      </div>
    );
  }
});


ReactDOM.render(
  //symbol used as this.prop.symbol
  <FilterableSymbolTable />,
  document.getElementById('content')
);

function formatThousands(num){
  return num > 999 ? (num/1000).toFixed(1) + 'k' : num
}
function formatDecimal(num){
  return Math.round(num*100)/100;
}

var SymbolTable = React.createClass({
  //suplying key to component, not to the container HTML
  render: function() {
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
          {this.props.symbols.map(function(symbol){
            return(
              <tr key={Math.random()}>
                <td>{symbol.Symbol} {symbol.Name}</td>
                <td>{formatDecimal(symbol.LastPrice)} </td>
                <td>{formatDecimal(symbol.Change)} ({formatDecimal(symbol.ChangePercent)})%</td>
                <td>{formatThousands(symbol.MarketCap)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    );
  }

});
var FilterableSymbolTable = React.createClass({
  getInitialState: function() {
    return {
      symbols: [],
      symbolsToSearch: ''
    };
  },
  componentDidMount: function() {
    //split symbols and search
    this.props.symbolsToSearch.split(',').forEach(function(symbol){
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

  render: function(){
    return (
      <div>
        <SymbolTable symbols={this.state.symbols} />
      </div>
    );
  }
});


ReactDOM.render(
  //symbol used as this.prop.symbol
  <FilterableSymbolTable symbolsToSearch='MSFT,AAPL,IBM,GOOG,FB,YHOO' />,
  document.getElementById('content')
);

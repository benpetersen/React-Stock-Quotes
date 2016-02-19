
var SymbolRow = React.createClass({
  render: function() {
    return (
      <tr>
        <td>{this.props.symbol.Symbol} {this.props.symbol.Name}</td>
        <td>{parseFloat(this.props.symbol.Change)}</td>
      </tr>
    );
  }
});

var SymbolTable = React.createClass({
  render: function() {
    var rows = [];
    this.props.symbols.forEach(function(symbol){
      rows.push(<SymbolRow symbol={symbol} key={symbol.Name} />);
    }.bind(this));

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Change in Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }

});
var FilterableSymbolTable = React.createClass({
  getInitialState: function() {
    return {
      symbols: [],
      newSymbol: '',
      symbolsToSearch: ['MSFT', 'AAPL']
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

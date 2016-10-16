var minID = localStorage.getItem('minID')
if (minID) {
  minID = parseInt(minID);
} else {
  minID = 1;
  localStorage.setItem('minID', minID)
}
function updateID() {
  localStorage.setItem('minID', ++minID);
  return minID;
}
function getContacts() {
  var contacts = localStorage.getItem('contacts');
  var parsedContacts;
  if (contacts) {
    parsedContacts = JSON.parse(contacts);
  } else {
    localStorage.setItem('contacts', '[]');
    parsedContacts = [];
  }
  return parsedContacts;
}
getContacts();

function saveContacts(contact) {
  var contacts = getContacts();
  contacts.push(contact);
  localStorage.setItem('contacts', JSON.stringify(contacts));
}

var MainView = React.createClass({
  render: function() {
    return (
      <div>
      <div className='nav' style={{backgroundColor: 'black'}}>
            <nav className='nav'>
                <ul className={'pull-left nav nav-justified center-block'}>
                    <li><a href='#Contacts' target={"_self"}>Contacts</a></li>
                    <li><a href='#Live' target={"_self"}>Live Video</a></li>
                    <li><a href='#Recent' target={"_self"}>Recent Activity</a></li>
                </ul>
            </nav>
        </div>
        <ContactView />
        </div>
    );
  }
});
var ContactView = React.createClass({

  render: function() {
    var contacts = getContacts();
    var contactsDivs = [<div key={'default'}></div>];
    for (var i in contacts) {
      var current = contacts[i];
      contactsDivs.push (
        <ContactCard key={current.id} name={current.name} phone={current.phone} email={current.email} image={current.picture}/>
      );
    }
    return (
      <div>
      <button type="button" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal">
        Add Contact
      </button>
      <div>
        {contactsDivs}
      </div>
      </div>

    );
  }
});

var ContactCard = React.createClass({
  render: function() {
    return (
      <div className='col-md-4'>
        <div className='row'>
          <h3 className='col-md-6'>{this.props.name}</h3>
          <img className='col-md-6 img-circle' style={{marginTop: '15px', width:'128px'}} src={this.props.image}/>
        </div>
        <p className='col-md-12'>Phone Number: {this.props.phone} </p>
        <p className='col-md-12'>Email: {this.props.email} </p>
      </div>
    )
  }
});
var Modal = React.createClass({
  render: function() {
    return (
      <div className="modal fade" id="modal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title" id="myModalLabel">Add Contact</h4>
            </div>
            <div className="modal-body">
            <Registration />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var Registration = React.createClass({
  getInitialState: function() {
    return {
      email: null,
      phone: null,
      name: null,
      picture: null
    };
  },
  handleName: function(e) {
    this.setState({name: e.target.value});
  },
  handleEmail: function(e) {
    this.setState({email: e.target.value});
  },
  handlePhone: function(e) {
    this.setState({phone: e.target.value});
  },
  handlePic: function(e) {
    this.setState({picture: e.target.value});
  },
  validateEmail: function() {
    var email = this.state.email;
    if (!email) return false;
    if (email.length > 0) {
      var reg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,9}(?:\.[a-z]{2})?)$/;
      return reg.test(email);
    } else {
      return false;
    }
  },
  createUser: function() {
    if (this.validateEmail() && this.state.phone && this.state.name && this.state.picture) {
      saveContacts({
        name: this.state.name,
        phone: this.state.phone,
        picture: this.state.picture,
        email: this.state.email,
        id: updateID()
      });
      window.location.reload();
    } else {
      alert('All fields must be filled')
    }
  },
  render: function() {
    return (
        <div>
          <div>
            <input className="form-control" style={{marginBottom: '12px'}} type="text" placeholder={'Name'} onChange={this.handleName}/>
          </div>
          <div>
            <input className="form-control" style={{marginBottom: '12px'}} type="text" placeholder={'Email'} onChange={this.handleEmail}/>
          </div>
          <div>
            <input className="form-control" style={{marginBottom: '12px'}} type="number" placeholder={'Phone'} onChange={this.handlePhone}/>
          </div>
          <div>
            <input className="form-control" style={{marginBottom: '12px'}} type="text" placeholder={'Picture URL'} onChange={this.handlePic}/>
          </div>
          <button onClick={this.createUser} className="btn btn-primary">
            Create Account
          </button>
        </div>
    );
  }
});

var Application = React.createClass({
  render: function() {
    return (
      <div>
      <MainView />
      <Modal />
      </div>
    )
  }
});
ReactDOM.render(
  <Application />,
  document.getElementById('content')
);

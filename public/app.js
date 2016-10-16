var minID = localStorage.getItem('minID')
if (minID) {
  minID = parseInt(minID);
} else {
  minID = 1;
  localStorage.setItem('minID', minID)
}

var showWebcam = false;
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

var WebcamView = React.createClass({
  loadCam: function() {

    this.seed = 0;
    Webcam.set({
    width: screen.width-25,
    height: screen.height-175,
    fps: 80,
    dest_width: 400,
    dest_height: 300,
});
    Webcam.attach( '#my_camera' );
    this.snapPics();
  },
  snapPics: function() {
    this.seed += 1;
    var _this = this;
    setTimeout(function() {
      Webcam.snap( function(data_uri) {
        console.log('called');
        var fd = {data: data_uri, seed: '2'};
        $.ajax({
          type: 'POST',
          url: 'https://hmivgifcxv.localtunnel.me/api/image/',
          data: fd,
        }).done(function(data) {
          $.ajax({
            type: 'POST',
            url: 'https://hmivgifcxv.localtunnel.me/api/verify/',
            data: {data: data},
          }).done(function(returnData) {
            var match = returnData.match;
            var certainty = returnData.certainty * 100;
            var matchName = returnData.matchName;
            console.log(matchName);
            var msg = new SpeechSynthesisUtterance('I was ' + (match ? '' : 'not ') + 'able to find a match' + (match ? (' of' + matchName) : '') + '  with' + certainty + ' percent certainty');
            window.speechSynthesis.speak(msg);
            console.log(returnData.match);
            console.log(returnData.certainty);
          });
        });
        if (showWebcam) {
          _this.snapPics();
        }
    });
  }, 10000);
  },
  dataURItoBlob: function(dataURI) {

    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
},

  render: function() {
    this.loadCam()
    return (
      <div>
      </div>
    )
  }
});

var MainView = React.createClass({
  getInitialState: function() {
    return {
      view: <ContactView />
    }
  },
  render: function() {
    var _this = this;
    return (
      <div>
      <div className='nav' style={{backgroundColor: 'black'}}>
            <nav className='nav'>
                <ul className={'pull-left nav nav-justified center-block'}>
                    <li><a href='#Contacts' target={"_self"} onClick={function() {
                      document.getElementById('my_camera').style.display = 'none';
                      _this.setState({view: <ContactView />});
                      console.log('hide');
                      showWebcam = false;
                    }}>Contacts</a></li>
                    <li><a href='#Live' onClick={function() {
                      document.getElementById('my_camera').style.display = 'block';
                      _this.setState({view: <WebcamView />});
                      showWebcam = true;
                      console.log('call');
                    }} target={"_self"}>Live Video</a></li>
                </ul>
            </nav>
        </div>
        {this.state.view}
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

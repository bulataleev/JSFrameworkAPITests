const api = require("../utils/CommonApiMethods");
const config = require("../config");
const expect = require("chai").expect;
const chance = require("chance");
const addContext = require('mochawesome/addContext');

const baseUrl = config.baseUrl;
const getVotes = baseUrl + config.getVotes;
const getRandomVote = baseUrl + config.getRandomVote;
const postVote = baseUrl + config.postVotes;
const getCreatedVote = baseUrl + config.getCreatedVote;
const deleteVote = baseUrl + config.deleteVote;
const getDeletedVote = baseUrl + config.getDeletedVote;


var _id, _res;

const _headers = {
    "Content-Type": "application/json",
    "x-api-key": "DEMO-API-KEY"
}
var response_objects=[];

var _body = {
    "image_id": "asf2",
    "sub_id": "my-user-1234",
    "value": 1
};
describe('/Get votes', function () {
    var res;
    var response_objects=[];
    
    // this.timeout(5000);
    it('verify OK status and unmarshal', async function () {
       
        res = await api.GET(getVotes, _headers);
        addContext(this, 'Response: ' + JSON.stringify(res.body));
        expect(res.statusCode, 'status is OK').equal(200);
        expect(JSON.stringify(res.body), "ERROR is detected in response").not.contains("error");
        //console.log("response is here: ");
        response_objects = JSON.parse(JSON.stringify(res.body));
        console.log(response_objects[0]);
        //console.log(_response_objects.length);
    });

    it('verify response parameters', function () {
        expect(res.body[0]).to.have.property('id');
        expect(res.body[0]).to.have.property('image_id');
        expect(res.body[0]).to.have.property('sub_id');
        expect(res.body[0]).to.have.property('created_at');
        expect(res.body[0]).to.have.property('id');
        expect(res.body[0]).to.have.property('country_code');
    });
});
describe('/Get random id  - /votes/{id}', function () {
    this.timeout(5000);
    let random_res;
    var random_id;
    var random_vote_id;
    var res;
    var response_objects=[];
    var random_object;
    var random_url;
    it('getting random id /votes/{id}, assertions: reponse is !empty and object values correspond', async function () {
        res = await api.GET(getVotes, _headers);
        addContext(this, 'Response: ' + JSON.stringify(res.body));
        expect(res.statusCode, 'status is not OK').equal(200);
        expect(JSON.stringify(res.body), "ERROR is detected in response").not.contains("error");
        //console.log("response is here: ");
        response_objects = JSON.parse(JSON.stringify(res.body));

        var o = response_objects[81];
        //console.log(o);


        random_id = Math.floor(Math.random() * (response_objects.length+1));
        //console.log(random_id);
        random_object = response_objects[random_id];
        random_vote_id= random_object["id"];

        
        random_url = getRandomVote.replace("{id}", random_vote_id);
        //random_url = getVotes+"/"+random_vote_id;
        console.log("random_url"+random_url);
        random_res =  await api.GET(random_url, _headers);
        expect(random_res.statusCode, 'status is not OK').equal(200);
        expect(JSON.stringify(res.body), "ERROR is detected in response").not.contains("error");
        //console.log(random_res);

        
    });
    it('verify random is the same as from the initial get request', async function () {
        expect(response_objects[random_id]).to.equals(random_object);
    });
});

describe('POST create new vote,  DELETE it and check deletion', function () {
    //this.timeout(3000);
    var res;
    var voted_id;
    var created_voteId_urll;
    var deleteVoteUrl;
    var getDeletedVoteUrl;
    it('Post verify OK status, "message":"SUCCESS" and id is not empty', async function () {
        console.log("url "+ postVote);
        res = await api.POST(postVote, _headers, _body);
        addContext(this, 'Response: ' + JSON.stringify(res.body));
        expect(res.statusCode, 'status not OK').to.equal(200);
        expect(JSON.stringify(res.body), "ERROR is detected in response").not.contains("error");
        expect(res.body["message"]).equals("SUCCESS");
        //console.log(res.body);
        voted_id = res.body["id"]+"";
        //console.log(voted_id);
        expect(voted_id).is.not.empty;

    });
    it('Get previosly created id. Verify status '+`${voted_id}`, async function () {
        console.log("url "+ postVote);
        created_voteId_urll = getCreatedVote.replace("{id}", voted_id);
        res = await api.GET(created_voteId_urll, _headers);
        addContext(this, 'Response: ' + JSON.stringify(res.body));
        expect(res.statusCode, 'status not OK').to.equal(200);
        //console.log(res.body);

    });
    it('Delete verify  success status', async function () {
        this.timeout(2000);
        deleteVoteUrl = deleteVote.replace("{vote_id}", voted_id);
        //console.log(deleteVoteUrl);
        res = await api.DELETE(deleteVoteUrl, _headers, '');
        addContext(this, 'Response: ' + JSON.stringify(res.body));
        expect(res.statusCode, 'status not OK').to.equal(200);
        expect(JSON.stringify(res.body), "ERROR is detected in response").not.contains("error");
        expect(JSON.stringify(res.body), "ERROR is detected in response").contains("SUCCESS");
       
        //expect(res.body["message"]).equals("SUCCESS");
    });
    it('Delete verify  success status', async function () {
        //this.timeout(2000);
        getDeletedVoteUrl = getDeletedVote.replace("{id}", voted_id);
        console.log( getDeletedVoteUrl);
        res = await api.GET( getDeletedVoteUrl, _headers);
        addContext(this, 'Response: ' + JSON.stringify(res.body));
        expect(res.statusCode, 'status not OK').to.equal(404);
        expect(JSON.stringify(res.body), "ERROR is detected in response").not.contains("error");
        //expect(JSON.stringify(res.body), "ERROR is detected in response").contains("SUCCESS");
       expect(res.body.message).equals('NOT_FOUND');
        
       
        //expect(res.body["message"]).equals("SUCCESS");
    });

});

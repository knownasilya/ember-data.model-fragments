var store, Person, Name;
var all = Ember.RSVP.all;

module("unit/fragments - DS.fragmentOwner", {
  setup: function() {
    Person = DS.Model.extend({
      name: DS.hasOneFragment("name"),
    });

    Name = DS.ModelFragment.extend({
      first : DS.attr("string"),
      last  : DS.attr("string"),
      person: DS.fragmentOwner()
    });

    store = createStore({
      name: Name
    });
  },

  teardown: function() {
    store = null;
    Person = null;
    Name = null;
  }
});

test("fragments can reference their owner record", function() {
  store.push(Person, {
    id: 1,
    name: {
      first: "Samwell",
      last: "Tarly"
    }
  });

  store.find(Person, 1).then(async(function(person) {
    var name = person.get('name');

    equal(name.get('person'), person, "`DS.fragmentOwner` property is reference to the owner record");
  }));
});

test("attempting to change a fragment's owner record throws an error", function() {
  store.push(Person, {
    id: 1,
    name: {
      first: "Samwell",
      last: "Tarly"
    }
  });

  store.push(Person, {
    id: 2,
    name: {
      first: "Samwell",
      last: "Tarly"
    }
  });

  all([
    store.find(Person, 1),
    store.find(Person, 2)
  ]).then(async(function(people) {
    var name = people[0].get('name');

    throws(function() {
      name.set('person', people[1]);

    }, "setting the owner property throws an error");
  }));
});

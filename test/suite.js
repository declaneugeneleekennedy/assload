
this.suite = {
    'Test Scripts': function(test) {
        test.expect(2);

        var ass = new AssLoad();

        ass.addScript('https://ajax.googleapis.com/ajax/libs/spf/2.1.2/spf.js')
                .then(function() {
                    test.ok(true, 'This promise should be resolved');
                });
        ass.addScript('https://ajax.googleapis.com/ajax/libs/spf/2.1.2/spf.404.js')
                .fail(function() {
                    test.ok(true, 'This promise should be rejected');
                });

        var $p = ass.promise();

        $.when($p).then(function() {
            test.done();
        });
    },
    'Test CSS': function(test) {
        test.expect(2);

        var ass = new AssLoad();

        ass.addCss('https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/themes/smoothness/jquery-ui.css')
            .then(function() {
                test.ok(true, 'This promise should be resolved');
            });

        ass.addCss('https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/themes/smoothness/jquery-ui.404.css')
            .fail(function() {
                test.ok(true, 'This promise should be rejected');
            });

        var $p = ass.promise();

        $.when($p).then(function() {
            test.done();
        });
    },
    'Test Images': function(test) {
        test.expect(2);

        var ass = new AssLoad();

        ass.addImage('http://placehold.it/350x300')
            .then(function() {
                test.ok(true, 'This promise should be resolved');
            });

        ass.addImage('http://placehold.404.it/350x300')
            .fail(function() {
                test.ok(true, 'This promise should be rejected');
            });

        var $p = ass.promise();

        $.when($p).then(function() {
            test.done();
        });
    },
    'Test Append': function(test) {
        test.expect(1);

        var ass = new AssLoad();

        ass.addImage('http://placehold.it/350x300')
            .then(function($el) {
                $el.attr('data-ass-test', 'on');
                $(document.body).append($el);
                test.equal($('img[data-ass-test="on"]').length, 1, 'Element should be in the DOM');
            });

        var $p = ass.promise();

        $.when($p).then(function() {
            test.done();
        });
    },
    'Test Tag-exists': function(test) {
        test.expect(1);

        var ass = new AssLoad();

        ass.addScript('https://ajax.googleapis.com/ajax/libs/spf/2.1.2/spf.js')
            .then(function($el) {
                $(document.head).append($el);
            });

        var $p = ass.promise();

        $.when($p).then(function() {
            var ass2 = new AssLoad();

            ass2.addScript('https://ajax.googleapis.com/ajax/libs/spf/2.1.2/spf.js')
                .then(function($el) {
                    test.ok(!$el, 'No element should be returned');
                });

            var $p2 = ass2.promise();

            $.when($p2).then(function() {
                test.done();
            });
        });
    }
};
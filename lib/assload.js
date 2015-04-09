
var AssLoad = (function($, CallbackQueue) {
    var queue = new CallbackQueue;

    function prepareEl($el) {
        $el.attr('data-ass', 'on');
        $el.attr('style', 'display: none');
    }

    function resetEl($el) {
        $el.removeAttr('data-ass');
        $el.removeAttr('style');
    }

    function add(tag, attributes) {
        var $d = $.Deferred();

        var $el = $(document.createElement(tag));

        prepareEl($el);

        $el.one('load', function() {
            var $doneEl = $el.clone();

            resetEl($doneEl);

            $d.resolve($doneEl);
        });

        $el.one('error', function(e) {
            $d.reject(e);
        });

        var $p = $d.promise();

        queue.add(function() {
            $(document.body).append($el);
            $el.attr(attributes);

            return $p;
        });

        return $p;
    }

    var $t = function(tags) {
        if(tags) {
            $.each(tags, function(attributes, tag) {
                var $p = add(tag, attributes);

                queue.add($p);
            });
        }
    };

    function tagExists(tag, attribute, value) {
        return ($(tag + '[' + attribute + '="' + value + '"]').length > 0);
    }

    $t.prototype.addScript = function(src) {
        if(tagExists('script', 'src', src)) {
            return $.Deferred().resolve().promise();
        }

        return add('script', { src: src });
    };

    $t.prototype.addImage = function(src) {
        return add('img', { src: src });
    };

    $t.prototype.addCss = function(href) {
        if(tagExists('link', 'href', href)) {
            return $.Deferred().resolve().promise();
        }

        return add('link', {
            href: href,
            rel: 'stylesheet'
        });
    };

    $t.prototype.promise = function() {
        var $p = queue.promise();

        $p.done(function() {
            $('[data-ass]').remove();
        });

        return $p;
    };

    return $t;
})(jQuery, CallbackQueue);
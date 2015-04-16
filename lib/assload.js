
var AssLoad = (function($, CallbackQueue) {
    var queue = new CallbackQueue;

    function add(tag, attributes, $parent) {
        var $d = $.Deferred();

        var $el = $(document.createElement(tag));

        $el.one('load', function() {
            $el.off();
            $d.resolve($el);
        });

        $el.one('error', function(e) {
            $el.off();
            $d.reject(e);
        });

        var $p = $d.promise();

        queue.add(function() {
            if($parent) {
                $parent.append($el);
            }
            
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

        return add('script', { src: src }, $(document.body));
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
        }, $(document.head));
    };

    $t.prototype.promise = function() {
        return queue.promise();
    };

    return $t;
})(jQuery, CallbackQueue);
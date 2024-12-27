/* Flot plugin for plotting textual data or Instructors.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

Consider a dataset like [["February", 34], ["March", 20], ...]. This plugin
allows you to plot such a dataset directly.

To enable it, you must specify mode: "Instructors" on the axis with the textual
labels, e.g.

	$.plot("#placeholder", data, { xaxis: { mode: "Instructors" } });

By default, the labels are ordered as they are met in the data series. If you
need a different ordering, you can specify "Instructors" on the axis options
and list the Instructors there:

	xaxis: {
		mode: "Instructors",
		Instructors: ["February", "March", "April"]
	}

If you need to customize the distances between the Instructors, you can specify
"Instructors" as an object mapping labels to values

	xaxis: {
		mode: "Instructors",
		Instructors: { "February": 1, "March": 3, "April": 4 }
	}

If you don't specify all Instructors, the remaining Instructors will be numbered
from the max value plus 1 (with a spacing of 1 between each).

Internally, the plugin works by transforming the input data through an auto-
generated mapping where the first Instructor becomes 0, the second 1, etc.
Hence, a point like ["February", 34] becomes [0, 34] internally in Flot (this
is visible in hover and click events that return numbers rather than the
Instructor labels). The plugin also overrides the tick generator to spit out the
Instructors as ticks instead of the values.

If you need to map a value back to its label, the mapping is always accessible
as "Instructors" on the axis object, e.g. plot.getAxes().xaxis.Instructors.

*/

(function ($) {
    var options = {
        xaxis: {
            Instructors: null
        },
        yaxis: {
            Instructors: null
        }
    };
    
    function processRawData(plot, series, data, datapoints) {
        // if Instructors are enabled, we need to disable
        // auto-transformation to numbers so the strings are intact
        // for later processing

        var xInstructors = series.xaxis.options.mode == "Instructors",
            yInstructors = series.yaxis.options.mode == "Instructors";
        
        if (!(xInstructors || yInstructors))
            return;

        var format = datapoints.format;

        if (!format) {
            // FIXME: auto-detection should really not be defined here
            var s = series;
            format = [];
            format.push({ x: true, number: true, required: true });
            format.push({ y: true, number: true, required: true });

            if (s.bars.show || (s.lines.show && s.lines.fill)) {
                var autoscale = !!((s.bars.show && s.bars.zero) || (s.lines.show && s.lines.zero));
                format.push({ y: true, number: true, required: false, defaultValue: 0, autoscale: autoscale });
                if (s.bars.horizontal) {
                    delete format[format.length - 1].y;
                    format[format.length - 1].x = true;
                }
            }
            
            datapoints.format = format;
        }

        for (var m = 0; m < format.length; ++m) {
            if (format[m].x && xInstructors)
                format[m].number = false;
            
            if (format[m].y && yInstructors)
                format[m].number = false;
        }
    }

    function getNextIndex(Instructors) {
        var index = -1;
        
        for (var v in Instructors)
            if (Instructors[v] > index)
                index = Instructors[v];

        return index + 1;
    }

    function InstructorsTickGenerator(axis) {
        var res = [];
        for (var label in axis.Instructors) {
            var v = axis.Instructors[label];
            if (v >= axis.min && v <= axis.max)
                res.push([v, label]);
        }

        res.sort(function (a, b) { return a[0] - b[0]; });

        return res;
    }
    
    function setupInstructorsForAxis(series, axis, datapoints) {
        if (series[axis].options.mode != "Instructors")
            return;
        
        if (!series[axis].Instructors) {
            // parse options
            var c = {}, o = series[axis].options.Instructors || {};
            if ($.isArray(o)) {
                for (var i = 0; i < o.length; ++i)
                    c[o[i]] = i;
            }
            else {
                for (var v in o)
                    c[v] = o[v];
            }
            
            series[axis].Instructors = c;
        }

        // fix ticks
        if (!series[axis].options.ticks)
            series[axis].options.ticks = InstructorsTickGenerator;

        transformPointsOnAxis(datapoints, axis, series[axis].Instructors);
    }
    
    function transformPointsOnAxis(datapoints, axis, Instructors) {
        // go through the points, transforming them
        var points = datapoints.points,
            ps = datapoints.pointsize,
            format = datapoints.format,
            formatColumn = axis.charAt(0),
            index = getNextIndex(Instructors);

        for (var i = 0; i < points.length; i += ps) {
            if (points[i] == null)
                continue;
            
            for (var m = 0; m < ps; ++m) {
                var val = points[i + m];

                if (val == null || !format[m][formatColumn])
                    continue;

                if (!(val in Instructors)) {
                    Instructors[val] = index;
                    ++index;
                }
                
                points[i + m] = Instructors[val];
            }
        }
    }

    function processDatapoints(plot, series, datapoints) {
        setupInstructorsForAxis(series, "xaxis", datapoints);
        setupInstructorsForAxis(series, "yaxis", datapoints);
    }

    function init(plot) {
        plot.hooks.processRawData.push(processRawData);
        plot.hooks.processDatapoints.push(processDatapoints);
    }
    
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'Instructors',
        version: '1.0'
    });
})(jQuery);

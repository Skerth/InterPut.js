/**
 * InterPut v0.1 - Красивый ввод интервала с помощью двух input
 * http://do-sites.ru
 *
 * Написал: Клятов Сергей, 2016
 * https://vk.com/id8584732
 *
 * Выпущен под лицензией MIT - http://opensource.org/licenses/MIT
 */

"use strict";

(function( $ ) {

  var methods = {

    init: function(options) {

      var settings = $.extend({
        checkMin: true,
        maxNumInput: 1E9,
        valueTitle: "Нажмите, чтобы выбрать интервал",
        inputMin: "input[name*='min']",
        inputMax: "input[name*='max']"
      }, options);

      return this.each(function() {		
        /**
         * ===================================================================================
         * = ПРИВАТНЫЕ ФУНКЦИИ
         * ===================================================================================
         */

        /**
         * Разбивает число на разряды, например: 54 000 000
         *
         * @param variable (string)
         * — строка для разбивки на разряды
         *
         * @return variable (string)
         * — строка, разбитая на разряды
         */
        function __breakdownNumberDischarges(variable) {
          return variable.replace(/(?=\B(?:\d{3})+\b)/g, ' ');
        }

        /**
         * Отображение окна с полями min — max
         */
        function __showInterval() {
          interPutWrapper.addClass("interPut-active");
        }

        /**
         * Скрытие окна с полями min — max
         */
        function __hideInterval() {
          interPutWrapper.removeClass("interPut-active");

          __generationValue(settings);
        }

        /**
         * Генерация и установка строки в виде "от *** до ***" или текст label
         *
         * @param settings (array)
         * — параметры плагина
         */
        function __generationValue(settings) {
          var checkMin = settings ? settings.checkMin : false,

              valueMin = inputMin.val(),
              textValueMin = "",

              valueMax = inputMax.val(),
              textValueMax = "",
              // поиск суффикса, например "руб."
              intervalSuffixText = intervalSuffix.text();
          // Если значение Min не пустая строка
          if(valueMin.length)
            // составление строки для min и разбитие значения на разряды
            textValueMin = 'от ' + __breakdownNumberDischarges(valueMin); 
          // Если значение Max не пустая строка
          if(valueMax.length)
            // составление строки для max и разбитие значения на разряды
            textValueMax = ' до ' + __breakdownNumberDischarges(valueMax); 
          // Если активна проверка значения min, и min > max
          if(checkMin && (parseInt(valueMin, 10) >= parseInt(valueMax, 10))) {
            // установить строку для max пустой        
            textValueMax = '';
            // установить значение поля max пустое
            inputMax.val('');
          }
          // Если значениен суффикса не пустое
          if(intervalSuffixText.length) {
            intervalSuffixText = ' ' + intervalSuffixText;
          }
          else {
            intervalSuffixText = '';
          }
          // Если одно из значений min или max не пустое
          if(valueMin.length || valueMax.length) {
            // подстановка сгенерированных строк в значение
            interPutValue.text( textValueMin + textValueMax + intervalSuffixText );
          }
          else {
            // иначе отображение текста label
            interPutValue.text(interPutLabel.text()); 
          }
        }
        
        /**
         * Ввод только числовых значений меньше 1 млрд в input
         *
         * @param input (object)
         * — объект поля input
         *
         * @param settings (array)
         * — параметры плагина
         *
         * @return (boolean)
         * — завершает выполнение скрипта при выполнении одного из условий
         */
        function __inputNumericOnly(input, settings) {
          var maxNumInput = settings.maxNumInput,
              // Предыдущее значение поля
              oldValue;
          // При вводе информации в input
          input.on("change keyup input click", function(e) {
            // Если нажата клавиша Enter
            if(e.keyCode == 13) {
              __hideInterval();
              
              return false;
            }
            // Если input содержит ведущий ноль и символы, кроме чисел
            if(input.val().match(/^0+|[^0-9]+/g)) {
              // убрать ведущие нули и оставить только числа
              input.val(input.val().replace(/^0+|[^0-9]+/g, '')); 

              return false;
            }
            // Если значение input больше или равно 1 млрд
            if(!( input.val() < maxNumInput)) {
              // установить предыдущее значение Input
              input.val( oldValue );
              
              return false;
            }

            __generationValue();
            // Сохранение предыдущего значения поля
            oldValue = input.val(); 
          });
        }
        
        /**
         * Отслеживание клика по InterPut
         */
        function __trackingClickInterPut() {
          $(document).on("click", function(e) {
            // Если клик был по одному из элементов InterPut
            if(interPutWrapper.has(e.target).length === 1) {
              __showInterval();
            }
            else {
              __hideInterval();
            }

            e.stopPropagation();
          });
        }
        
        /**
         * Отслеживание клика по полю "от *** до ***" и установка фокуса на Min
         */
        function __clickInterPutValue() {
          interPutValue.on( "click", function () {
            // Нужно дождаться, чтобы применился class активности InterPut
            setTimeout(function () {
              inputMin.focus();
            }, 0);
          });
        }

        var interPutWrapper = $(this),
            interPutLabel = interPutWrapper.find("label"),

            // Блок красивого отображения значения "от *** до ***"
            interPutValue = interPutLabel.after("<div class='interPut-value' title='" +
                                                settings.valueTitle + "'>" +
                                                interPutLabel.text() +
                                                "</div>"
            ).next(),
            // Всплывающее окно с полями
            interPutItem = interPutWrapper.find(".interPut-item"),
            // Поля min и max
            inputMin = interPutItem.find(settings.inputMin),
            inputMax = interPutItem.find(settings.inputMax),
            // Поиск суффикса, например "руб."
            intervalSuffix = interPutItem.find(".suffix");
            
        // Сбор обработчиков воедино
        __trackingClickInterPut();
        __clickInterPutValue();
        __inputNumericOnly(inputMin, settings);
        __inputNumericOnly(inputMax, settings);
      });
      
    }
    
  };
  
  jQuery.fn.interPut = function(options) {
    return methods.init.apply(this, arguments);
  };

})(jQuery);
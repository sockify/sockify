package logging

import (
	"log"
	"sync"
	"time"
)

type HTTPLogEntry struct {
	Level      string
	Method     string
	URLPath    string
	RemoteAddr string
	Duration   time.Duration
}

type AsyncHTTPLogger struct {
	logChannel chan HTTPLogEntry
	wg         sync.WaitGroup
}

func NewAsyncHTTPLogger() *AsyncHTTPLogger {
	logger := &AsyncHTTPLogger{
		logChannel: make(chan HTTPLogEntry, 100), // Buffered channel to handle logs
	}
	logger.wg.Add(1)
	go logger.processLogs()
	return logger
}

func (l *AsyncHTTPLogger) Info(method, urlPath string, remoteAddr string, duration time.Duration) {
	l.log(LevelInfo, method, urlPath, remoteAddr, duration)
}

func (l *AsyncHTTPLogger) Warn(method, urlPath string, remoteAddr string, duration time.Duration) {
	l.log(LevelWarn, method, urlPath, remoteAddr, duration)
}

func (l *AsyncHTTPLogger) Error(method, urlPath string, remoteAddr string, duration time.Duration) {
	l.log(LevelError, method, urlPath, remoteAddr, duration)
}

// Close stops the logger and waits for any remaining log entries to be processed.
func (l *AsyncHTTPLogger) Close() {
	close(l.logChannel)
	l.wg.Wait()
}

func (l *AsyncHTTPLogger) processLogs() {
	defer l.wg.Done()
	for entry := range l.logChannel {
		log.Printf("[%s] %s %q from %s in %vms\n",
			entry.Level,
			entry.Method,
			entry.URLPath,
			entry.RemoteAddr,
			entry.Duration.Milliseconds(),
		)
	}
}

func (l *AsyncHTTPLogger) log(level, method, urlPath string, remoteAddr string, duration time.Duration) {
	l.logChannel <- HTTPLogEntry{
		Level:      level,
		Method:     method,
		URLPath:    urlPath,
		RemoteAddr: remoteAddr,
		Duration:   duration,
	}
}

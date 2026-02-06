# Makefile for Sphinx documentation

SPHINXOPTS    ?=
SPHINXBUILD   ?= sphinx-build
SOURCEDIR     = source
BUILDDIR      = build

.PHONY: help Makefile html html-zh html-en clean all

help:
	@$(SPHINXBUILD) -M help "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

# Build HTML documentation for Chinese
html-zh:
	@$(SPHINXBUILD) -b html "$(SOURCEDIR)" "$(BUILDDIR)/html-zh" $(SPHINXOPTS) $(O)

# Build HTML documentation for English
html-en:
	@$(SPHINXBUILD) -b html "$(SOURCEDIR)" "$(BUILDDIR)/html-en" $(SPHINXOPTS) $(O) -D master_doc=index_en -D language=en

# Default: Build Chinese (for backward compatibility)
html: html-zh

# Clean build directory
clean:
	rm -rf "$(BUILDDIR)"

# Build both Chinese and English versions
all: html-zh html-en
	@echo "Built both Chinese and English versions"
	@echo "Chinese version: build/html-zh/index.html"
	@echo "English version: build/html-en/index_en.html"

# Catch-all target: route all unknown targets to Sphinx using the new
# "make mode" option.  $(O) is meant as a shortcut for $(SPHINXOPTS).
%: Makefile
	@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)
